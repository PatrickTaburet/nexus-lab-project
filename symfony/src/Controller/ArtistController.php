<?php

namespace App\Controller;

use Symfony\Component\{
    HttpFoundation\Request,
    HttpFoundation\Response,
    Routing\Annotation\Route
};
use App\Entity\{
    AddScene,
    User
};
use App\Form\AddSceneType;
use App\Repository\AddSceneRepository;
use App\Service\{
    CodeFileUploader,
    OptionFieldProcessor
};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\Form\FormError;

#[Route("/artist", name: "artist_")]
class ArtistController extends AbstractController
{

    #[Route("/add-new-scene/{id}", name: "addScene", methods: ["GET", "POST"])]
    public function addScene( 
        EntityManagerInterface $entityManager, 
        Request $request, 
        CodeFileUploader $uploader,
        OptionFieldProcessor $optionField,
        ?int $id 
    ): Response {   
        $sceneRequest = new AddScene(); 

        $form = $this->createForm(AddSceneType::class, $sceneRequest);
        $form -> handleRequest($request); 
     
        if ( $form->isSubmitted()){

            $file = $form->get('codeFile')->getData();
            if (!$file) {
                $form->get('codeFile')->addError(new FormError('A code file is required.'));
            } 
            if ($form->isValid()) {
                $uniqueFileName = $uploader->upload($file);
                $sceneRequest->setCodeFile($uniqueFileName);   
                $sceneRequest->setUser($this->getUser());

                // Add the value of the "Other" option to the main language array
                $language = $sceneRequest->getLanguage();
                $otherLanguage = $form->get('otherLanguage')->getData();
                $mergedLanguages = $optionField->appendCustomChoice($language, $otherLanguage);
                $sceneRequest->setLanguage($mergedLanguages);
    
                $entityManager->persist($sceneRequest);
                $entityManager->flush();
    
                $this->addFlash('success', 'New scene request sent.'); 
    
                return $this->redirectToRoute('home');         
            }
        }
        
        $category = ($id === 1) ? 'Generative Art' : ($id === 2 ? 'Data Art Visualization' : 'Unknown Category');
        return $this->render('artist/addScene.html.twig', [
            'form' => $form->createView(),
            'category' => $category,
        ]);
    }

    #[Route("/dashboard", name: "artistDashboard")]
    public function artistDashboard(AddSceneRepository $newScene): Response
    {
        $user = $this->getUser();
        if (!$user instanceof User) {
            throw $this->createAccessDeniedException('You must be logged in to access this page.');
        }
        $userId = $user->getId();
        // Sorting all requests by creation date
        $sceneRequests = $newScene->findBy(
            ['user' => $userId],
            ['updatedAt' => 'DESC']
        );
    
        return $this->render('artist/myScenes.html.twig', [
           'sceneRequests' => $sceneRequests,
        ]);
    }

    #[Route("/delete/request/{id}", name: "delete_request", methods: ["GET", "POST"])]
    public function deleteSceneRequest(EntityManagerInterface $entityManager, AddSceneRepository $sceneReq, $id): Response
    {
        $request = $sceneReq->find($id);
        if (!$request) {
            throw $this->createNotFoundException('Scene not found.');
        }
        $user = $this->getUser();
        if (!$user || $request->getUser() !== $user) {
            throw $this->createAccessDeniedException('You are not allowed to delete this request.');
        }
        $filesystem = new Filesystem();
        $filePath = $this->getParameter('code_directory') . '/' . $request->getCodeFile();
        if ($filesystem->exists($filePath)) {
            $filesystem->remove($filePath);
        }
        $entityManager->remove($request);
        $entityManager->flush();
        $this->addFlash('success', 'Request successfully deleted');
        return $this->redirectToRoute('artist_artistDashboard');
    }
}
