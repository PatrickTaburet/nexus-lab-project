<?php

namespace App\Controller\Api;
use App\Repository\{
    Scene1Repository,
    Scene2Repository,
    SceneD1Repository,
    SceneD2Repository,
};
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\{
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpKernel\Exception\NotFoundHttpException
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;



class api_LikeController extends AbstractController
{
    #[Route("api/like/artwork/{id}/{entity}", name: "api_artwork_like")]
    public function like(EntityManagerInterface $entityManager, $id, $entity): JsonResponse
    {
        try
        {
            $user = $this->getUser();
            $entityClass = "App\\Entity\\" . $entity;
            if (!class_exists($entityClass)) {
                return new JsonResponse(['error' => 'Invalid entity type'], Response::HTTP_BAD_REQUEST);
            }
    
            $repo = $entityManager->getRepository($entityClass);
            $artwork = $repo->find($id);
    
            if ($artwork->isLikedByUser($user)){
                $artwork->removeLike($user);
                $entityManager->flush();
                $likes = $artwork->getLikes()->count();
                return $this ->json(['message'=> 'Like successfully deleted.', 'likes' => $likes]);
            }
            $artwork->addLike($user);
            $entityManager->flush();
            $likes = $artwork->getLikes()->count();
            return $this ->json(['message'=> 'Like successfully added.', 'likes' => $likes]);
        } catch (NotFoundHttpException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 404);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'An error occurred'], 500);
        }
    }
}
