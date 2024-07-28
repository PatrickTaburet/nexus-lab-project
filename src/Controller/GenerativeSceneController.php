<?php

namespace App\Controller;

use App\Entity\{
    User,
    Scene1,
    Scene2
};
use App\Form\{
    SaveArtworkG1Type,
    SaveArtworkG2Type,
};
use App\Repository\{
    Scene1Repository,
    Scene2Repository
};
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\{
    Request,
    Response,
    JsonResponse,
    File\UploadedFile,
};
use Symfony\Component\{
    Routing\Annotation\Route,
    Serializer\SerializerInterface,
    Serializer\Normalizer\NormalizerInterface
};
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class GenerativeSceneController extends AbstractController
{

// ----------- SCENE G1 : Random Line Walkers -----------

    #[Route("sceneG1", name: "sceneG1")]
    public function sceneG1(): Response
    {
        return $this->render('generative_scene/sceneG1.html.twig', [
        ]);
    }   

    #[Route("/generative/newScene-G1/{id}", name: "newSceneG1", methods: ["GET"])]
    public function newSceneG1(Scene1Repository $repo, SerializerInterface $serializer, $id): Response
    {
        $scene = $repo -> find($id); 

        // NORMALIZED + ENCODE METHOD :
        // //transform complex object in an associative array (only group sceneDataRecup to avoid infinite loop with the user entity)
        // $sceneNormalized = $normalizer->normalize($scene, null, ['groups'=> 'sceneDataRecup']);
        // // then encore into json format
        // $json = json_encode($sceneNormalized);

        // Serializer method :
        $json = $serializer->serialize($scene,'json',['groups'=> 'sceneDataRecup']); 
            // Décoder le JSON en tableau associatif
        $sceneData = json_decode($json, true);

        return $this->render('generative_scene/newSceneG1.html.twig', [
            'scene' => $sceneData,
        ]);   
    }

    #[Route("/generative/sendDataG1", name: "send_data_G1", methods: ["POST"])]
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

        // Create a temporary file from the image data
        $tempFile = tmpfile();

        // Write the image data to the temporary file
        fwrite($tempFile, $imageData);

        // Get the absolute path of the temporary file
        $tempFilePath = stream_get_meta_data($tempFile)['uri'];

         // Get the image name
         $imageName = pathinfo($tempFilePath, PATHINFO_FILENAME) . '.png';

        // Créer un nouvel objet UploadedFile
        $imageFile = new UploadedFile($tempFilePath,  $imageName, 'image/png', null, true);

        $user = $entityManager
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

            $entityManager->persist($data);
            $entityManager->flush();

        // Delete the temporary file
            fclose($tempFile);

        // Catch the id of the scene object to make redirection in js to the "saveArtwork form" after saving data in database.
            $id = $data->getId();
            return new JsonResponse(['message' => 'Data successfully saved!', 'redirectUrl' => $this->generateUrl('saveSceneG', ['id' => $id, 'entity' => 'Scene1'])]);

        // redirection managed in javascript
        } 
            return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);
    }

// ----------- SCENE G2 : Noise Orbit -----------


    #[Route("sceneG2", name: "sceneG2")]
    public function sceneG2(): Response
    {
        return $this->render('generative_scene/sceneG2.html.twig', [
        ]);
    }   

    #[Route("/generative/sendDataG2", name: "send_data_G2", methods: ["POST"])]
    public function sendDataToSceneG2(Request $request, EntityManagerInterface $entityManager): Response
    {
        $hue = $request->request->get('hue');
        $colorRange = $request->request->get('colorRange');
        $brightness = $request->request->get('brightness');
        $movement = $request->request->get('movement');
        $deformA = $request->request->get('deformA');
        $deformB = $request->request->get('deformB');
        $shape = $request->request->get('shape');
        $rings = $request->request->get('rings');
        $zoom = $request->request->get('zoom');
        $diameter = $request->request->get('diameter');
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

        $user = $entityManager
        ->getRepository(User::class)
        ->find($userId);
        
        if ($hue !== null &&
            $colorRange !== null &&
            $brightness !== null &&
            $movement !== null &&
            $deformA !== null &&
            $deformB !== null &&
            $shape !== null &&
            $rings !== null &&
            $zoom !== null &&
            $diameter !== null &&
            $userId  !== null
            ) {
            $data = new Scene2;
            $data ->setHue($hue);
            $data ->setColorRange($colorRange);
            $data ->setBrightness($brightness);
            $data ->setMovement($movement);
            $data ->setDeformA($deformA);
            $data ->setDeformB($deformB);
            $data ->setShape($shape);
            $data ->setRings($rings);
            $data ->setZoom($zoom);
            $data ->setDiameter($diameter);
            $data ->setUser($user);
            $data->setImageFile($imageFile);

            $entityManager->persist($data);
            $entityManager->flush();

        // Delete the temporary file
            fclose($tempFile);

        // Catch the id of the scene object to make redirection in js to the "saveArtwork form" after saving data in database.
            $id = $data->getId();
            return new JsonResponse(['message' => 'Data successfully saved!', 'redirectUrl' => $this->generateUrl('saveSceneG', ['id' => $id, 'entity' => 'Scene2'])]);

        // redirection managed in javascript
        } 
            return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);   
    }

    #[Route("/generative/newScene-G2/{id}", name: "newSceneG2", methods: ["GET"])]
    public function newSceneG2(
        Scene2Repository $repo,
        SerializerInterface $serializer,
        $id
    ): Response
    {
        $scene = $repo -> find($id); 

        // SERIALIZER METHOD :
        $json = $serializer->serialize($scene,'json',['groups'=> 'sceneDataRecup']); 
            // Décoder le JSON en tableau associatif
        $sceneData = json_decode($json, true);

        return $this->render('generative_scene/newSceneG2.html.twig', [
            'scene' => $sceneData,
        ]);   
    }

     //  ----------  Global functions -------------

     #[Route("dataScene/saveSceneG/{entity}/{id}", name: "saveSceneG")]
     public function saveArtworkG(Request $request,
         EntityManagerInterface $entityManager,
         $id,
         $entity
    ): Response
    {
        switch ($entity) {
            case 'Scene1':
                $repo = $entityManager->getRepository(Scene1::class);
                $formType = SaveArtworkG1Type::class;
                $redirectRoute = 'sceneG1';
                break;

            case 'Scene2':
                $repo = $entityManager->getRepository(Scene2::class);
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
            $entityManager->persist($scene);
            $entityManager->flush();

            $this->addFlash('success', 'Artwork save in the gallery'); 
            return $this->redirectToRoute($redirectRoute);
        }
        return $this->render('main/saveArtwork.html.twig', [
            'form' => $form->createView(),
            'scene' => $scene
        ]);
    }   
}
