<?php

namespace App\Controller\Api;

use App\Entity\User;
use App\Entity\Scene1;
use App\Entity\SceneD2;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class api_DataSceneController extends AbstractController
{
    private $entityManager;
    
    public function __construct(EntityManagerInterface $entityManager,) {
        $this->entityManager = $entityManager;
    }
   
    #[Route("api/dataScene/sendDataD2", name: "api_send_data_D2", methods: ["POST"])]
    public function api_sendDataToSceneD2(Request $request): JsonResponse
    {   
        $data = json_decode($request->getContent(), true);
        if (!$data) {
            throw new \Exception('Invalid JSON data');
        }
        $divFactor = $data['divFactor'] ?? null;
        $copy = $data['copy'] ?? null;
        $deformation = $data['deformation'] ?? null;
        $sizeFactor = $data['sizeFactor'] ?? null;
        $angle = $data['angle'] ?? null;
        $opacity = $data['opacity'] ?? null;
        $filters = $data['filters'] ?? null;
        $division = $data['division'] ?? null;
        $colorRange = $data['colorRange'] ?? null;
        $glitch = $data['glitch'] ?? null;
        $noise = $data['noise'] ?? null;
        $colorsValue = $data['colorsValue'] ?? null;
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
        
        if ($divFactor !== null &&
            $copy !== null &&
            $deformation !== null &&
            $sizeFactor !== null &&
            $angle !== null &&
            $opacity !== null &&
            $filters !== null &&
            $division !== null &&
            $colorRange !== null &&
            $glitch !== null &&
            $noise !== null &&
            $userId  !== null &&
            $colorsValue !== null
            ) {
            $data = new SceneD2;
            $data ->setDivFactor($divFactor);
            $data ->setCopy($copy);
            $data ->setDeformation($deformation);
            $data ->setSizeFactor($sizeFactor);
            $data ->setAngle($angle);
            $data ->setOpacity($opacity);
            $data ->setFilters($filters);
            $data ->setDivision($division);
            $data ->setColorRange($colorRange);
            $data ->setGlitch($glitch);
            $data ->setNoise($noise);
            $data ->setColorsValue($colorsValue);
            $data ->setUser($user);
            $data->setImageFile($imageFile);

            $this->entityManager->persist($data);
            $this->entityManager->flush();

        // Delete the temporary file
            fclose($tempFile);

        // Catch the id of the scene object to make redirection in js to the "saveArtwork form" after saving data in database.
            $id = $data->getId();
            return new JsonResponse([
                'message' => 'Data successfully saved!',
                'sceneId' => $id
            ]);
        } 
        return new JsonResponse('Error: Missing data!', Response::HTTP_BAD_REQUEST);
    }
}
