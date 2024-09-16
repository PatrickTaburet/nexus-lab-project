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
use Symfony\Component\Serializer\SerializerInterface;

class api_MainController extends AbstractController
{
    private $entityManager;
    private $serializer;

    
    public function __construct(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ) {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
    }

    #[Route('/api/gallery/', name: 'api_gallery', methods: ['GET'])]
    public function api_gallery(Request $request, Scene1Repository $repo, SceneD1Repository $repo2, Scene2Repository $repo3, SceneD2Repository $repo4): JsonResponse
    {
        try {
            $user = $this->getUser();
            $page = $request->query->getInt('page', 1);
            $limit = $request->query->getInt('limit', 20);
            $repositories = [
                ['repo' => $repo, 'prefix' => 'Scene1_'],
                ['repo' => $repo2, 'prefix' => 'SceneD1_'],
                ['repo' => $repo3, 'prefix' => 'Scene2_'],
                ['repo' => $repo4, 'prefix' => 'SceneD2_'],
            ];
            $allScenes = [];
            foreach ($repositories as $repository) {
                $scenes = $repository['repo']->findBy([], ['updatedAt' => 'DESC'], $limit, ($page - 1) * $limit);

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
            return new JsonResponse($allScenes, Response::HTTP_OK);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred while fetching the gallery.'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
