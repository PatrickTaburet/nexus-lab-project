<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\{
    HttpFoundation\Response,
    Routing\Annotation\Route,
    HttpKernel\Exception\NotFoundHttpException
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;



class LikeController extends AbstractController
{
    #[Route("/like/artwork/{id}/{entity}", name: "artwork_like")]
    public function like(EntityManagerInterface $entityManager, $id, string $entity): JsonResponse 
    {
        $user = $this->getUser();
        if (!$user) {
            return $this->json(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $entityClass = "App\\Entity\\" . $entity;
        if (!class_exists($entityClass)) {
            return $this->json(['error' => 'Invalid entity type: ' . $entity], Response::HTTP_BAD_REQUEST);
        }

        $artwork = $entityManager->getRepository($entityClass)->find($id);
        if (!$artwork) {
            return $this->json(['error' => 'Artwork not found'], Response::HTTP_NOT_FOUND);
        }

        if ($artwork->isLikedByUser($user)){
            $artwork->removeLike($user);
            $message = 'Like successfully removed.';
        } else {
            $artwork->addLike($user);
            $message = 'Like successfully added.';
        }
      
        $entityManager->flush();
        $likesCount = $artwork->getLikes()->count();
        
        return $this->json(['message' => $message, 'likes' => $likesCount]);
    }
}
