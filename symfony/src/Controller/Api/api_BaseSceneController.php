<?php

namespace App\Controller\Api;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class api_BaseSceneController extends AbstractController
{
    private $entityManager;
    
    public function __construct(EntityManagerInterface $entityManager,) {
        $this->entityManager = $entityManager;
    }
   
    #[Route("api/saveScene/{entity}/{id}", name: "api_saveScene")]
    public function api_SaveArtwork(Request $request, $id, $entity): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);
            if (!$data) {
                throw new \Exception('Invalid JSON data');
            }
    
            $entityClass = "App\\Entity\\" . $entity;
            if (!class_exists($entityClass)) {
                throw new \Exception('Invalid entity type');
            }
    
            $repo = $this->entityManager->getRepository($entityClass);
            $scene = $repo->find($id);
            if (!$scene) {
                throw new \Exception('Entity not found');
            }
    
            $scene->setComment($data['comment'] ?? '');
            $scene->setTitle($data['title'] ?? '');
            
            $this->entityManager->persist($scene);
            $this->entityManager->flush();
    
            return new JsonResponse([
                'message' => 'Comment and title successfully saved!'
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => $e->getMessage()
            ], 500);
        }
    }   

    #[Route("api/artworks/delete/{id}/{entity}", name: "api_deleteArtwork", methods: ["POST", "GET"])]
    public function api_Delete(
        $id,
        $entity,
    ): JsonResponse
    {
        try {
            $currentUser = $this->getUser();
            $entityClass = "App\\Entity\\" . $entity;
            if (!class_exists($entityClass)) {
                throw new \Exception('Invalid entity type');
            }
            $repo = $this->entityManager->getRepository($entityClass);
            $artwork = $repo->find($id);

            if (!$artwork || $artwork->getUser() !== $currentUser) {
                throw new \Exception('You are not allowed to delete this artwork.');
            }
        
            $this->entityManager->remove($artwork);
            $this->entityManager->flush();
        
            return new JsonResponse([
                'message' => 'Artwork removed'
            ]);
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => $e->getMessage()
            ], 400);
        }
    }
    #[Route("api/artworks/{id}/{entity}", name: "api_getArtwork", methods: ["POST", "GET"])]
    public function api_GetArtwork($id, $entity): JsonResponse
    {
        try {
            $entityClass = "App\\Entity\\" . $entity;
            if (!class_exists($entityClass)) {
                return new JsonResponse(['error' => 'Invalid entity type'], Response::HTTP_BAD_REQUEST);
            }
    
            $repo = $this->entityManager->getRepository($entityClass);
            $artwork = $repo->find($id);
            $title = $artwork->getTitle();
            $comment = $artwork->getComment();
            $imageName = $artwork->getImageName();

            return new JsonResponse([
                'title' => $title,
                'comment' => $comment,
                'imageName' => $imageName,
            ], Response::HTTP_OK);      
        } catch (\Exception $e) {
            return new JsonResponse([
                'error' => $e->getMessage()
            ], 400);
        }
    }
}
