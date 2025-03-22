<?php

namespace App\Controller;

use App\Entity\CollectiveDrawing;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\HttpFoundation\Request;

class CollectiveDrawingController extends BaseSceneController
{
    #[Route('/collective-drawing/saveDrawing', name: 'send_collective_drawing')]
    public function saveDrawing(Request $request): Response
    {
        $canvasData = json_decode($request->getContent(), true);
        $user = $this->getUser();

        if ($canvasData !== null && $user !== null) {
            $drawing = new CollectiveDrawing();
            $drawing->setData($canvasData);
            $drawing->setUser($user);

            $this->entityManager->persist($drawing);
            $this->entityManager->flush();

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
