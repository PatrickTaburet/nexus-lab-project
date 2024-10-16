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
};
use App\Model\SceneData;
use Symfony\Bundle\SecurityBundle\Security;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

abstract class BaseSceneController extends AbstractController
{
    protected EntityManagerInterface $entityManager;
    protected Security $security;
    protected SceneD1Repository $sceneD1Repo;
    protected SceneD2Repository $sceneD2Repo;
    protected Scene1Repository $scene1Repo;
    protected Scene2Repository $scene2Repo;
    
    public function __construct(
        EntityManagerInterface $entityManager,
        Security $security,
        SceneD1Repository $sceneD1Repo,
        SceneD2Repository $sceneD2Repo,
        Scene1Repository $scene1Repo,
        Scene2Repository $scene2Repo
    ) {
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
            'SceneD1' => new SceneData(SceneD1::class, SaveArtworkD1Type::class, 'sceneD1', 'data_scene', $this->sceneD1Repo),
            'SceneD2' => new SceneData(SceneD2::class, SaveArtworkD2Type::class, 'sceneD2', 'data_scene', $this->sceneD2Repo),
            'Scene1' => new SceneData(Scene1::class, SaveArtworkG1Type::class, 'sceneG1', 'generative_scene', $this->scene1Repo),
            'Scene2' => new SceneData(Scene2::class, SaveArtworkG2Type::class, 'sceneG2', 'generative_scene', $this->scene2Repo)
        ];
        return $data[$entity] ?? null;
    }

    #[Route("scene/{entity}/{id?}", name: "getScene")]
    public function getScene(string $entity, $id = null): Response
    {
        $sceneDataObj = $this->getSceneProps($entity);

        if ($id !== null) { 
            $scene = $sceneDataObj->getRepository()->find($id);
        } else {
            $scene = null;
        }
        return $this->render("{$sceneDataObj->getSceneType()}/{$sceneDataObj->getRouteName()}.html.twig", [
            'scene' => $scene,
        ]);  
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
