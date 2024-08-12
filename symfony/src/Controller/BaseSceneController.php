<?php

namespace App\Controller;

use App\Entity\{
    SceneD1,
    SceneD2,
    Scene1,
    Scene2
};
use App\Form\{
    SaveArtworkD1Type,
    SaveArtworkD2Type,
    SaveArtworkG1Type,
    SaveArtworkG2Type
};
use App\Repository\{
    SceneD1Repository,
    SceneD2Repository,
    Scene1Repository,
    Scene2Repository
};
use Symfony\Component\HttpFoundation\{
    Response,
    Request,
};
use Symfony\Component\{
    Routing\Annotation\Route,
    Serializer\SerializerInterface,
};
use App\Model\SceneData;
use Symfony\Bundle\SecurityBundle\Security;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

abstract class BaseSceneController extends AbstractController
{
    protected  SerializerInterface $serializer;
    protected EntityManagerInterface $entityManager;
    protected Security $security;
    protected SceneD1Repository $sceneD1Repo;
    protected SceneD2Repository $sceneD2Repo;
    protected Scene1Repository $scene1Repo;
    protected Scene2Repository $scene2Repo;
    
    public function __construct(
        SerializerInterface $serializer,
        EntityManagerInterface $entityManager,
        Security $security,
        SceneD1Repository $sceneD1Repo,
        SceneD2Repository $sceneD2Repo,
        Scene1Repository $scene1Repo,
        Scene2Repository $scene2Repo
    ) {
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
        $this->security = $security;
        $this->sceneD1Repo = $sceneD1Repo;
        $this->sceneD2Repo = $sceneD2Repo;
        $this->scene1Repo = $scene1Repo;
        $this->scene2Repo = $scene2Repo;
    }

    private function getSceneProps(string $entity): ?SceneData
    {
        $data = [
            'SceneD1' => new SceneData(SceneD1::class, SaveArtworkD1Type::class, 'sceneD1', 'newSceneD1', 'data_scene', $this->sceneD1Repo),
            'SceneD2' => new SceneData(SceneD2::class, SaveArtworkD2Type::class, 'sceneD2', 'newSceneD2','data_scene', $this->sceneD2Repo),
            'Scene1' => new SceneData(Scene1::class, SaveArtworkG1Type::class, 'sceneG1', 'newSceneG1','generative_scene', $this->scene1Repo),
            'Scene2' => new SceneData(Scene2::class, SaveArtworkG2Type::class, 'sceneG2', 'newSceneG2', 'generative_scene', $this->scene2Repo)
        ];
        return $data[$entity] ?? null;
    }

    #[Route("saveScene/{entity}/{id}", name: "saveScene")]
    public function saveArtwork(Request $request, $id, $entity): Response
    {
        $sceneData = $this->getSceneProps($entity);
        if (!$sceneData) {
            throw $this->createNotFoundException('Invalid entity type.');
        }
        $repo = $this->entityManager->getRepository($sceneData->getEntityClass());
        $formType = $sceneData->getFormType();

        $redirectRoute = $sceneData->getRouteName();

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
            return $this->redirectToRoute($redirectRoute);
        }
        return $this->render('main/saveArtwork.html.twig', [
            'form' => $form->createView(),
            'scene' => $scene
        ]);
    }   

    #[Route("/newScene/{entity}/{id}", name: "newScene", methods: ["GET"])]
    public function getSceneData(string $entity, int $id): Response
    {
       $sceneDataObj = $this->getSceneProps($entity);

        $scene = $sceneDataObj->getRepository()->find($id);
        $json = $this->serializer->serialize($scene, 'json', ['groups' => 'sceneDataRecup']);
        $sceneData = json_decode($json, true);

        return $this->render("{$sceneDataObj->getSceneType()}/{$sceneDataObj->getNewRouteName()}.html.twig", [
            'scene' => $sceneData,
        ]);   
    } 
}
