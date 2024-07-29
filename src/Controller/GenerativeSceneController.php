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
use Symfony\Component\HttpFoundation\{
    Request,
    Response,
    JsonResponse,
    File\UploadedFile,
};
use Symfony\Component\{
    Routing\Annotation\Route,
    Serializer\Normalizer\NormalizerInterface
};

class GenerativeSceneController extends BaseSceneController
{

// ----------- SCENE G1 : Random Line Walkers -----------

    #[Route("sceneG1", name: "sceneG1")]
    public function sceneG1(): Response
    {
        return $this->render('generative_scene/sceneG1.html.twig', [
        ]);
    }   

    #[Route("/generative/sendDataG1", name: "send_data_G1", methods: ["POST"])]
    public function sendData(Request $request): Response
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

        $user = $this->entityManager
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

            $this->entityManager->persist($data);
            $this->entityManager->flush();

        // Delete the temporary file
            fclose($tempFile);

        // Catch the id of the scene object to make redirection in js to the "saveArtwork form" after saving data in database.
            $id = $data->getId();
            return new JsonResponse(['message' => 'Data successfully saved!', 'redirectUrl' => $this->generateUrl('saveScene', ['id' => $id, 'entity' => 'Scene1'])]);

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
    public function sendDataToSceneG2(Request $request): Response
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

        $user = $this->entityManager
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

            $this->entityManager->persist($data);
            $this->entityManager->flush();

        // Delete the temporary file
            fclose($tempFile);

        // Catch the id of the scene object to make redirection in js to the "saveArtwork form" after saving data in database.
            $id = $data->getId();
            return new JsonResponse(['message' => 'Data successfully saved!', 'redirectUrl' => $this->generateUrl('saveScene', ['id' => $id, 'entity' => 'Scene2'])]);

        // redirection managed in javascript
        } 
            return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);   
    }
}

