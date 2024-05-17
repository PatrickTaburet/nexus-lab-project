<?php

namespace App\Controller;

use App\Entity\AddScene;
use App\Form\AddSceneType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

/**
* @Route("/artist"), name="artist_"
*/
class ArtistController extends AbstractController
{
 /**
    * @Route("/add-new-scene", name="addScene", methods= {"GET", "POST"})
    */
    public function addScene( EntityManagerInterface $entityManager, Request $request): Response
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
        }  elseif ($form->isSubmitted()) {
            $this->addFlash('warning', 'Invalid file type. Please upload a file with a .txt extension.');
            return $this->redirectToRoute('addScene');
        }

        return $this->render('admin/addScene.html.twig', [
            'form' => $form->createView(),
        ]);
    }
    /**
     * @Route("/dashboard", name="artistDashboard")
     */
    public function artistDashboard(): Response
    {
        return $this->render('artist/myScenes.html.twig', [
            'controller_name' => 'MainController',
        ]);
    }
}
