<?php

namespace App\Controller;

use App\Factory\SceneDataFactory;
use Symfony\Component\HttpFoundation\{
    Response,
    Request,
};
use Symfony\Component\{
    Routing\Annotation\Route,
};
use Symfony\Bundle\SecurityBundle\Security;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


abstract class BaseSceneController extends AbstractController
{
    protected EntityManagerInterface $entityManager;
    protected Security $security;
    private SceneDataFactory $sceneDataFactory;

    
    public function __construct(SceneDataFactory $sceneDataFactory, Security $security, EntityManagerInterface $entityManager)
    {
        $this->sceneDataFactory = $sceneDataFactory;
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    #[Route("scene/{entity}/{id?}", name: "getScene")]
    public function getScene(string $entity, $id = null): Response
    {
        $sceneDataObj = $this->sceneDataFactory->createSceneData($entity);
        if (!$sceneDataObj) {
            throw $this->createNotFoundException('Scene type not found.');
        }
        $scene = $id !== null ? $sceneDataObj->getRepository()->find($id) : null;

        return $this->render("{$sceneDataObj->getSceneType()}/{$sceneDataObj->getRouteName()}.html.twig", [
            'scene' => $scene,
        ]);  
    }   

    #[Route("saveScene/{entity}/{id}", name: "saveScene")]
    public function saveArtwork(Request $request, $id, $entity): Response
    {
        $sceneData = $this->sceneDataFactory->createSceneData($entity);
        
        if (!$sceneData) {
            throw $this->createNotFoundException('Invalid entity type.');
        }
        $repo = $this->entityManager->getRepository($sceneData->getEntityClass());
        $formType = $sceneData->getFormType();

        $scene = $repo->find($id);
        if (!$scene) {
            throw $this->createNotFoundException('Scene not found');
        }
        $form = $this->createForm($formType, $scene);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) { 
            $this->entityManager->persist($scene);
            $this->entityManager->flush();

            $this->addFlash('success', 'Artwork save in the gallery'); 
            return $this->redirectToRoute('getScene', ['entity' => $entity]);
        }

        return $this->render('main/saveArtwork.html.twig', [
            'form' => $form->createView(),
            'scene' => $scene
        ]);
    }   
}
