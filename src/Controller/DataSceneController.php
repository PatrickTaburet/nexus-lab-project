<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\SceneD1;
use App\Entity\SceneD2;
use App\Form\SaveArtworkD1Type;
use App\Form\SaveArtworkD2Type;
use App\Repository\SceneD1Repository;
use App\Repository\SceneD2Repository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;


class DataSceneController extends AbstractController
{
    /**
     * @Route("/sceneD1", name="sceneD1")
     */
    public function sceneD1(): Response
    {
        return $this->render('data_scene/sceneD1.html.twig', [
            'controller_name' => 'DataSceneController',
        ]);
    }
    /**
    * @Route("/dataScene/newScene-D1/{id}", name="newSceneD1", methods= {"GET"}))
    */
    public function newSceneD1(SceneD1Repository $repo, SerializerInterface $serializer, $id): Response
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
        return $this->render('data_scene/newSceneD1.html.twig', [
            'scene' => $sceneData,
        ]);   
    }
    
    /**
    * @Route("/dataScene/sendDataD1", name="send_data_D1", methods={"POST"})
    */
    public function sendDataToSceneD1(Request $request, EntityManagerInterface $entityManager, Security $security): Response
    {
        $randomness = $request->request->get('randomness');
        $looping = $request->request->get('looping');
        $abstract = $request->request->get('abstract');
        $country1 = $request->request->get('country1');
        $country2 = $request->request->get('country2');
        $country3 = $request->request->get('country3');
        $country4 = $request->request->get('country4');
        $country5 = $request->request->get('country5');
        $country6 = $request->request->get('country6');
        $country7 = $request->request->get('country7');
        $country8 = $request->request->get('country8');
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

        // Get the logged user
        $user = $security->getUser();
        
        if ($randomness !== null &&
            $looping !== null &&
            $abstract !== null &&
            $userId  !== null
            ) {
            $data = new SceneD1;
            $data ->setRandomness($randomness);
            $data ->setLooping($looping);
            $data ->setAbstract($abstract);
            $data ->setCountry1($country1);
            $data ->setCountry2($country2);
            $data ->setCountry3($country3);
            $data ->setCountry4($country4);
            $data ->setCountry5($country5);
            $data ->setCountry6($country6);
            $data ->setCountry7($country7);
            $data ->setCountry8($country8);
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
            return new JsonResponse(['message' => 'Data successfully saved!', 'redirectUrl' => $this->generateUrl('saveD1', ['id' => $id])]);
            // redirection managed in javascript
        } 
            return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);
    }

    /**
    * @Route("dataScene/saveSceneD1/{id}", name="saveD1")
    */
    public function saveArtwork(Request $request, EntityManagerInterface $entityManager, SceneD1Repository $repo, $id): Response
    {
        $scene = $repo->find($id);
        $form = $this->createForm(SaveArtworkD1Type::class, $scene);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) { 
            $entityManager->persist($scene);
            $entityManager->flush();

            $this->addFlash('success', 'Artwork save in the gallery'); 
            return $this->redirectToRoute('sceneD1');
        }
        return $this->render('main/saveArtwork.html.twig', [
            'form' => $form->createView(),
            'scene' => $scene
        ]);
    }   

    //  ---------- Scene D2 -------------

    /**
    * @Route("/sceneD2", name="sceneD2")
    */
    public function sceneD2(): Response
    {
        return $this->render('data_scene/sceneD2.html.twig', [
            'controller_name' => 'DataSceneController',
        ]);
    }

     /**
    * @Route("/dataScene/sendDataD2", name="send_data_D2", methods={"POST"})
    */
    public function sendDataToSceneD2(Request $request, EntityManagerInterface $entityManager, Security $security): Response
    {
        $divFactor = $request->request->get('divFactor');
        $copy = $request->request->get('copy');
        $deformation = $request->request->get('deformation');
        $sizeFactor = $request->request->get('sizeFactor');
        $angle = $request->request->get('angle');
        $opacity = $request->request->get('opacity');
        $filters = $request->request->get('filters');
        $division = $request->request->get('division');
        $colorRange = $request->request->get('colorRange');
        $glitch = $request->request->get('glitch');
        $noise = $request->request->get('noise');
        $userId = $request->request->get('userId');
        $imgFile = $request->request->get('file');
        $colorsValue = $request->request->get('colorsValue');
        
        
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

        // Get the logged user
        $user = $security->getUser();
        
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

         // Link image to the upload file
            $data->setImageFile($imageFile);

            $entityManager = $this->getDoctrine()->getManager();
            $entityManager->persist($data);
            $entityManager->flush();

         // Delete the temporary file
            fclose($tempFile);

         // Catch the id of the scene object to make redirection in js to the "saveArtwork form" after saving data in database.

            $id = $data->getId();
            return new JsonResponse(['message' => 'Data successfully saved!', 'redirectUrl' => $this->generateUrl('saveD2', ['id' => $id])]);
            // redirection managed in javascript
        } 
            return new Response('Error: Missing data!', Response::HTTP_BAD_REQUEST);
    }

     /**
    * @Route("dataScene/saveSceneD2/{id}", name="saveD2")
    */
    public function saveArtworkD2(Request $request, EntityManagerInterface $entityManager, SceneD2Repository $repo, $id): Response
    {
        $scene = $repo->find($id);
        $form = $this->createForm(SaveArtworkD2Type::class, $scene);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) { 
            $entityManager->persist($scene);
            $entityManager->flush();

            $this->addFlash('success', 'Artwork save in the gallery'); 
            return $this->redirectToRoute('sceneD2');
        }
        return $this->render('main/saveArtwork.html.twig', [
            'form' => $form->createView(),
            'scene' => $scene
        ]);
    }   
    
     /**
    * @Route("/dataScene/newScene-D2/{id}", name="newSceneD2", methods= {"GET"}))
    */
    public function newSceneD2(SceneD2Repository $repo, SerializerInterface $serializer, $id): Response
    {
        $scene = $repo -> find($id); 
        $json = $serializer->serialize($scene,'json',['groups'=> 'sceneDataRecup']);
        // Décoder le JSON en tableau associatif
        $sceneData = json_decode($json, true);
    

        return $this->render('data_scene/newSceneD2.html.twig', [
            'scene' => $sceneData,
        ]);   
    }
}
