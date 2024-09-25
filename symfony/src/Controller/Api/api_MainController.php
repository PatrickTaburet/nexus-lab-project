<?php

namespace App\Controller\Api;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Repository\{
    Scene1Repository,
    Scene2Repository,
    SceneD1Repository,
    SceneD2Repository,
};

class api_MainController extends AbstractController
{
    private $entityManager;

    public function __construct(
        EntityManagerInterface $entityManager,
    ) {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/gallery/', name: 'api_gallery', methods: ['GET'])]
    public function api_gallery(Request $request, Scene1Repository $repo, SceneD1Repository $repo2, Scene2Repository $repo3, SceneD2Repository $repo4): JsonResponse
    {
        try {
            $user = $this->getUser();
            $sortOption = $request->query->get('sort', 'date');
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 10);
            $repositories = [
                ['repo' => $repo, 'prefix' => 'Scene1_'],
                ['repo' => $repo2, 'prefix' => 'SceneD1_'],
                ['repo' => $repo3, 'prefix' => 'Scene2_'],
                ['repo' => $repo4, 'prefix' => 'SceneD2_'],
            ];
            $allScenes = [];
            foreach ($repositories as $repository) {
                $scenes = $repository['repo']->findAll();
                foreach ($scenes as $scene) {
                    $allScenes[] = [
                        'id' => $repository['prefix'] . $scene->getId(),
                        'updatedAt' => $scene->getUpdatedAt() ? $scene->getUpdatedAt()->format('Y-m-d H:i:s') : null,
                        'title' => $scene->getTitle(),
                        'comment' => $scene->getComment(),
                        'user' => $scene->getUser() ? [
                            'id' => $scene->getUser()->getId(),
                            'username' => $scene->getUser()->getPseudo(),
                            'avatar' => $scene->getUser()->getImageName(),
                        ] : null,
                        'imageName' => $scene->getImageName(),
                        'likes' => count($scene->getLikes()),
                        'isLiked' => $scene->isLikedByUser($user)
                    ];
                }
            }
            if ($sortOption === 'likes') {
                usort($allScenes, function ($a, $b) {
                    return $b['likes'] <=> $a['likes']; 
                });
            } else {
                usort($allScenes, function ($a, $b) {
                    return strtotime($b['updatedAt']) <=> strtotime($a['updatedAt']);
                });
            }
            $paginatedScenes = array_slice($allScenes, ($page - 1) * $limit, $limit);

            return new JsonResponse($paginatedScenes, Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred while fetching the gallery.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
