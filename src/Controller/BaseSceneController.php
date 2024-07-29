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
    
      public function __construct(SerializerInterface $serializer, EntityManagerInterface $entityManager, Security $security)
    {
        $this->serializer = $serializer;
        $this->entityManager = $entityManager;
        $this->security = $security;
    }

    private function getSceneProps(string $entity): ?SceneData
    {
        $data = [
            'SceneD1' => new SceneData(SceneD1::class, SaveArtworkD1Type::class, 'sceneD1', 'newSceneD1', 'data_scene', SceneD1Repository::class),
            'SceneD2' => new SceneData(SceneD2::class, SaveArtworkD2Type::class, 'sceneD2', 'newSceneD2','data_scene', SceneD2Repository::class),
            'Scene1' => new SceneData(Scene1::class, SaveArtworkG1Type::class, 'sceneG1', 'newSceneG1','generative_scene', Scene1Repository::class),
            'Scene2' => new SceneData(Scene2::class, SaveArtworkG2Type::class, 'sceneG2', 'newSceneG2', 'generative_scene', Scene2Repository::class)
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
        
        $sceneData = $this->getSceneProps($entity);
        var_dump($sceneData->getSceneType());
        if (!$sceneData) {
            throw $this->createNotFoundException("Scene not found: $entity.");
        }
        $repo = $this->entityManager->getRepository($sceneData->getRepositoryClass());
        $scene = $repo->find($id);
        if (!$scene) {
            throw $this->createNotFoundException('Scene not found');
        }

        $json = $this->serializer->serialize($scene, 'json', ['groups' => 'sceneDataRecup']);
        $sceneData = json_decode($json, true);

        return $this->render("{$sceneData->getSceneType()}/{$sceneData->getNewRouteName()}.html.twig", [
            'scene' => $sceneData,
        ]);
        // $repositories = [
        //     'Scene1' => [$RepoG1, "newSceneG1", "generative_scene"],
        //     'Scene2' => [$RepoG2, "newSceneG2", "generative_scene"],
        //     'SceneD1' => [$RepoD1, "newSceneD1", "data_scene"],
        //     'SceneD2' => [$RepoD2, "newSceneD2", "data_scene"]
        // ];
        // if (!array_key_exists($entity, $repositories)) {
        //     throw $this->createNotFoundException("Scene not found: $entity.");
        // }
        // $scene = $repositories[$entity][0]->find($id);
        // $return = $repositories[$entity][1];
       
       // $sceneType = $repositories[$entity][2];

        // return $this->render("$sceneType/$return.html.twig", [
        //     'scene' => $sceneData,
        // ]);   
    } 
}
