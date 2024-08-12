<?php

namespace App\Controller;

use Symfony\Component\{
    HttpFoundation\Request,
    HttpFoundation\Response,
    Routing\Annotation\Route
};
use App\Entity\AddScene;
use App\Entity\User;
use App\Form\AddSceneType;
use App\Repository\AddSceneRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[Route("/artist", name: "artist_")]
class ArtistController extends AbstractController
{

    #[Route("/add-new-scene/{id}", name: "addScene", methods: ["GET", "POST"])]
    public function addScene( EntityManagerInterface $entityManager, Request $request, ?int $id ): Response
    {   
        $sceneRequest = new AddScene(); 

        $form = $this->createForm(AddSceneType::class, $sceneRequest);
        $form -> handleRequest($request); 
     
        if ( $form->isSubmitted() && $form->isValid()){
            /** @var UploadedFile $file */
            $file = $form->get('codeFile')->getData();
                // Extract the file name and extension
            $fileName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $fileExtension = $file->guessExtension();           
            // Generate a unique file name
            $uniqueFileName = $fileName. uniqid(). '.'. $fileExtension;
                        
            $file->move($this->getParameter('code_directory'), $uniqueFileName);
            $sceneRequest->setCodeFile($uniqueFileName);
        
            $sceneRequest->setUser($this->getUser());

            // Add the value of the "Other" option to the main language array
            $language = $sceneRequest->getLanguage();
            $otherLanguage = $form->get('otherLanguage')->getData();
           
            if ($otherLanguage && in_array("other", $language)) {
                $language[] = $otherLanguage;
            }
            $sceneRequest->setLanguage($language);
            $entityManager->persist($sceneRequest);
            $entityManager->flush();

            $this->addFlash('success', 'New scene request sent.'); 

            return $this->redirectToRoute('home');

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
            // Gérez le cas où l'utilisateur n'est pas connecté ou est d'un type inattendu
            throw $this->createAccessDeniedException('You must be logged in to access this page.');
        }
        $userId = $user->getId();
        $sceneRequests = $newScene->findby(['user' => $userId]);
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
        $entityManager->remove($request);
        $entityManager->flush();
        $this->addFlash('success', 'Request successfully deleted');
        return $this->redirectToRoute('artist_artistDashboard');
    }
}
