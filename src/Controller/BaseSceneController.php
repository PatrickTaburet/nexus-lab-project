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
    JsonResponse,
    File\UploadedFile,
};
use Symfony\Component\{
    Routing\Annotation\Route,
    Serializer\SerializerInterface,
};
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

    #[Route("saveScene/{entity}/{id}", name: "saveScene")]
    public function saveArtwork(Request $request,
        $id,
        $entity
    ): Response
    {
        switch ($entity) {
            case 'SceneD1':
                $repo = $this->entityManager->getRepository(SceneD1::class);
                $formType = SaveArtworkD1Type::class;
                $redirectRoute = 'sceneD1';
                break;

            case 'SceneD2':
                $repo = $this->entityManager->getRepository(SceneD2::class);
                $formType = SaveArtworkD2Type::class;
                $redirectRoute = 'sceneD2';
                break;
            case 'Scene1':
                $repo = $this->entityManager->getRepository(Scene1::class);
                $formType = SaveArtworkG1Type::class;
                $redirectRoute = 'sceneG1';
                break;
            case 'Scene2':
                $repo = $this->entityManager->getRepository(Scene2::class);
                $formType = SaveArtworkG2Type::class;
                $redirectRoute = 'sceneG2';
                break;

            default:
                throw $this->createNotFoundException('Invalid entity type.');
        }

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
    public function getSceneData(
        Scene1Repository $RepoG1,
        Scene2Repository $RepoG2,
        SceneD1Repository $RepoD1,
        SceneD2Repository $RepoD2,
        string $entity,
        int $id
    ): Response
    {
        $repositories = [
            'Scene1' => [$RepoG1, "newSceneG1", "generative_scene"],
            'Scene2' => [$RepoG2, "newSceneG2", "generative_scene"],
            'SceneD1' => [$RepoD1, "newSceneD1", "data_scene"],
            'SceneD2' => [$RepoD2, "newSceneD2", "data_scene"]
        ];
        if (!array_key_exists($entity, $repositories)) {
            throw $this->createNotFoundException("Scene not found: $entity.");
        }
        $scene = $repositories[$entity][0]->find($id);
        $return = $repositories[$entity][1];
       
        $sceneType = $repositories[$entity][2];
        $json = $this->serializer->serialize($scene, 'json', ['groups' => 'sceneDataRecup']);
        $sceneData = json_decode($json, true);
        return $this->render("$sceneType/$return.html.twig", [
            'scene' => $sceneData,
        ]);   
    } 
}
