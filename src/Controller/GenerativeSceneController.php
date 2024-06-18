<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Scene1;
use App\Form\SaveArtworkG1Type;
use App\Repository\Scene1Repository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Vich\UploaderBundle\Handler\DownloadHandler;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class GenerativeSceneController extends AbstractController
{

// ----------- SCENE G1 : Random Line Walkers -----------

    /**
     * @Route("/sceneG1", name="sceneG1")
     */
    public function sceneG1(): Response
    {
        return $this->render('generative_scene/sceneG1.html.twig', [
        ]);
    }   

     /**
     * @Route("/generative/newScene-G1/{id}", name="newSceneG1", methods= {"GET"}))
     */
    public function newSceneG1(Scene1Repository $repo, SerializerInterface $serializer, $id): Response
    {
        $scene = $repo -> find($id); 

        // NORMALIZED + ENCODE METHOD :
        // //transform complex object in an associative array (only group sceneDataRecup to avoid infinite loop with the user entity)
        // $sceneNormalized = $normalizer->normalize($scene, null, ['groups'=> 'sceneDataRecup']);
        // // then encore into json format
        // $json = json_encode($sceneNormalized);

        // SERIALIZER METHOD :
        $json = $serializer->serialize($scene,'json',['groups'=> 'sceneDataRecup']); 
            // Décoder le JSON en tableau associatif
        $sceneData = json_decode($json, true);

        return $this->render('generative_scene/newSceneG1.html.twig', [
            'scene' => $sceneData,
        ]);   
    }

    /**
    * @Route("/generative/sendDataG1", name="send_data_G1", methods={"POST"})
    */
    public function sendData(Request $request, EntityManagerInterface $entityManager): Response
    {
        
        $color = $request->request->get('color');
        $saturation = $request->request->get('saturation');
        $opacity = $request->request->get('opacity');
        $weight = $request->request->get('weight');
        $numLine = $request->request->get('numLine');
        $velocity = $request->request->get('velocity');
        $noiseOctave = $request->request->get('noiseOctave');
        $noiseFalloff = $request->request->get('noiseFalloff');
        $userId = $request->request->get('userId');
        $imgFile = $request->request->get('file');
        
        // Decode the base64 string and save it as a .png file
        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imgFile));

    
        // Créer un fichier temporaire à partir des données image
        $tempFile = tmpfile();

        // Écrire les données image dans le fichier temporaire
        fwrite($tempFile, $imageData);
        // Obtenir le chemin absolu du fichier temporaire
        $tempFilePath = stream_get_meta_data($tempFile)['uri'];
         // Get the image name
         $imageName = pathinfo($tempFilePath, PATHINFO_FILENAME) . '.png';
        // Créer un nouvel objet UploadedFile
        $imageFile = new UploadedFile($tempFilePath,  $imageName, 'image/png', null, true);

        $user = $this->getDoctrine()
        ->getRepository(User::class)
        ->find($userId);
        
        if ($color !== null &&
            $weight !== null &&
            $numLine !== null &&
            $saturation !== null &&
            $opacity !== null &&
            $velocity !== null &&
            $noiseOctave !== null &&
            $noiseFalloff !== null &&
            $userId  !== null
            ) {
            $data = new Scene1;
            $data ->setColor($color);
            $data ->setWeight($weight);
            $data ->setNumLine($numLine);
            $data ->setSaturation($saturation);
            $data ->setOpacity($opacity);
            $data ->setVelocity($velocity);
            $data ->setNoiseOctave($noiseOctave);
            $data ->setNoiseFalloff($noiseFalloff);
            $data ->setUser($user);
        // Link image to the upload file
            $data->setImageFile($imageFile);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($data);
            $entityManager->flush();

        // Delete the temporary file
            fclose($tempFile);

        // Catch the id of the scene object to make redirection in js to the "saveArtwork form" after saving data in database.
            $id = $data->getId();
            return new JsonResponse(['message' => 'Data successfully saved!', 'redirectUrl' => $this->generateUrl('saveG1', ['id' => $id])]);

        // redirection managed in javascript
        } 
            return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);
        
    }

    /**
    * @Route("generative/saveSceneG1/{id}", name="saveG1")
    */
    public function saveArtwork(Request $request, EntityManagerInterface $entityManager, Scene1Repository $repo, $id): Response
    {
        $scene = $repo->find($id);
        $form = $this->createForm(SaveArtworkG1Type::class, $scene);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) { 
            $entityManager->persist($scene);
            $entityManager->flush();

            $this->addFlash('success', 'Artwork save in the gallery'); 
            return $this->redirectToRoute('sceneG1');
        }
        return $this->render('main/saveArtwork.html.twig', [
            'form' => $form->createView(),
            'scene' => $scene
        ]);
    }   

// ----------- SCENE G2 : Noise Orbit -----------


    /**
     * @Route("/sceneG2", name="sceneG2")
     */
    public function sceneG2(): Response
    {
        return $this->render('generative_scene/sceneG2.html.twig', [
        ]);
    }   




}
