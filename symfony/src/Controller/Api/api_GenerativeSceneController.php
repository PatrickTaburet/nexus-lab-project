<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Scene1;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class api_GenerativeSceneController extends AbstractController
{
    private $entityManager;
    
    public function __construct(EntityManagerInterface $entityManager,) {
        $this->entityManager = $entityManager;
    }
   
    #[Route("api/generative/sendDataG1", name: "api_send_data_G1", methods: ["POST"])]
    public function api_sendDataToSceneG1(Request $request): JsonResponse
    {   
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            throw new \Exception('Invalid JSON data');
        }
        $color = $data['color'] ?? null;
        $saturation = $data['saturation'] ?? null;
        $opacity = $data['opacity'] ?? null;
        $weight = $data['weight'] ?? null;
        $numLine = $data['numLine'] ?? null;
        $velocity = $data['velocity'] ?? null;
        $noiseOctave = $data['noiseOctave'] ?? null;
        $noiseFalloff = $data['noiseFalloff'] ?? null;
        $userId = $data['userId'] ?? null;
        $imgFile = $data['file'] ?? null;
        if (!$userId) {
            throw new \Exception('User ID is missing');
        }
        // $user = $this->getUser();
        $user = $this->entityManager
        ->getRepository(User::class)
        ->find($userId);
        if (!$user) {
            throw new \Exception('User not found');
        }
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
            return new JsonResponse([
                'message' => 'Data successfully saved!',
                'sceneId' => $id,
            ]);

        // redirection managed in javascript
        } 
        return new JsonResponse('Error: Missing data!', Response::HTTP_BAD_REQUEST);
    }

}
