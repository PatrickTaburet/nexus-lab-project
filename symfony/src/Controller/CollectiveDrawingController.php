<?php

namespace App\Controller;

use App\Entity\CollectiveDrawing;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

class CollectiveDrawingController extends BaseSceneController
{
    #[Route("/create/collective-drawing", name: "collectiveDrawingLobby")]
    public function collectiveDrawing(): Response
    {
        $scene = null;
        return $this->render('collective_drawing/collectiveDrawing.html.twig', [
            'scene' => $scene,
        ]);
    }

    #[Route('/collective-drawing/saveDrawing', name: 'send_collective_drawing')]
    public function saveDrawing(Request $request): Response
    {
        $imgFile = $request->request->get('file');
        $canvasData = $request->request->get('data');
        $user = $this->getUser();

        $imageData = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $imgFile));
        $tempFile = tmpfile();
        fwrite($tempFile, $imageData);
        $tempFilePath = stream_get_meta_data($tempFile)['uri'];
        $imageName = pathinfo($tempFilePath, PATHINFO_FILENAME) . '.png';
        $imageFile = new UploadedFile($tempFilePath,  $imageName, 'image/png', null, true);
        
        if ($canvasData !== null && $user !== null && $imgFile !== null) {
            $drawing = new CollectiveDrawing();
            $drawing->setData(json_decode($canvasData, true));
            $drawing->setUser($user);
            $drawing->setImageFile($imageFile);

            $this->entityManager->persist($drawing);
            $this->entityManager->flush();
            fclose($tempFile);
            
            return new JsonResponse([
                'message' => 'Data successfully saved!', 
                'redirectUrl' => $this->generateUrl('saveScene', [
                    'id' => $drawing->getId(), 
                    'entity' => 'CollectiveDrawing'
                ])
            ], Response::HTTP_CREATED);
        }
   
        // redirection managed in javascript

        return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);
    }
}
