<?php

namespace App\Tests\Functional\Controller;

use App\Entity\AddScene;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Tests\Traits\FormErrorAssertionsTrait;
use App\Tests\Traits\FormFileHelperTrait;

class ArtistControllerTest extends WebTestCase
{
    use FormErrorAssertionsTrait;
    use FormFileHelperTrait;
    private User $user;
    private $client;

    protected function setUp(): void
    {
        parent::setUp();
    
        $this->client = static::createClient();
        $container = $this->client->getContainer();
        $em = $container->get('doctrine')->getManager();
        $repo = $em->getRepository(User::class);
        
        $user = new User();
        $user->setEmail('artist@test.com');
        $user->setPseudo('artist_user');
        $user->setPassword('hashed-password');
        $user->setRoles(['ROLE_ARTIST']);
    
        $em->persist($user);
        $em->flush();
    
        $this->user = $repo->findOneBy(['email' => 'artist@test.com']);
    }
    
    /**
     * @dataProvider provideCategoryAccessData
     */
    public function testAddSceneFormAccessByCategory(int $categoryId, string $expectedLabel): void
    {
        $this->client->loginUser($this->user);
        $this->client->request('GET', '/artist/add-new-scene/' . $categoryId);

        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('form');
        $this->assertSelectorTextContains('h1', 'Add new Scene');
        $this->assertSelectorTextContains('.categoryLabel', $expectedLabel);
    }

    public function provideCategoryAccessData(): array
    {
        return [
            'Generative Art' => [1, 'Generative Art'],
            'Data Art Visualization' => [2, 'Data Art Visualization'],
        ];
    }

    public function testAddSceneFormRoleAccess(): void
    {
        $user = new User();
        $user->setEmail('nonArtist@test.com');
        $user->setPseudo('nonArtist_user');
        $user->setPassword('hashed-password');
        $user->setRoles([]);

        $container = $this->client->getContainer();
        $em = $container->get('doctrine')->getManager();
        $em->persist($user);
        $em->flush();

        $nonArtistUser = $em->getRepository(User::class)->findOneBy(['email' => 'nonArtist@test.com']);

        $this->client->loginUser($nonArtistUser);
        $this->client->request('GET', '/artist/add-new-scene/1');

        $this->assertResponseStatusCodeSame(403);
    }

    
    public function testSubmitValidAddSceneForm(): void
    {
        $this->client->loginUser($this->user);

        $crawler = $this->client->request('GET', '/artist/add-new-scene/1');
        $form = $crawler->selectButton('Submit')->form();

        $form['add_scene[title]'] = 'Test Scene';
        $form['add_scene[description]'] = 'Test description';
        $form['add_scene[language][0]']->tick();
        $form['add_scene[language][4]']->tick();
        $form['add_scene[otherLanguage]'] = 'TestLang123';
        $codeFile = $this->createTempCodeFile();
        $form['add_scene[codeFile]']->upload($codeFile);
        $imageFile = $this->createTempImageFile();
        $form['add_scene[imageFile][file]']->upload($imageFile);
        $this->client->submit($form);

        // Cleaning code file
        unlink($codeFile->getRealPath());

        $uploadDir = __DIR__ . '/../../../public/code/';

        // Get all files, sorted by their last modification time,
        $files = glob($uploadDir . '*');
        usort($files, function ($a, $b) {
            return filemtime($b) - filemtime($a);
        });
        // Get the most recently modified file, and delete it
        $latestFile = $files[0];
        unlink($latestFile);

        // Cleaning image file (.tmp)
        $this->deleteTmpImages('addSceneImg');
        unlink($imageFile->getRealPath());

        // Assertions
        $this->assertResponseRedirects('/', 302);
        $this->client->followRedirect();
        $this->assertSelectorExists('.flash-success');
        
        // Persistance
        $em = static::getContainer()->get('doctrine')->getManager();
        $scene = $em->getRepository(AddScene::class)->findOneBy(['title' => 'Test Scene']);
        $this->assertNotNull($scene);
        $this->assertStringContainsString('TestLang123', implode(',', $scene->getLanguage()));

    }

    public function testSubmitInvalidAddSceneForm(): void
    {
        $this->client->loginUser($this->user);
        $crawler = $this->client->request('GET', '/artist/add-new-scene/1');
        $form = $crawler->selectButton('Submit')->form();

        $this->client->submit($form);

        $this->assertResponseStatusCodeSame(200);
        $this->assertFormErrorDisplayed('Please select at least one language.');
    }

    public function testSubmitFormWithoutTitle(): void
    {
        $this->client->loginUser($this->user);
        $crawler = $this->client->request('GET', '/artist/add-new-scene/1');
        $form = $crawler->selectButton('Submit')->form();
    
        // Invalid completion 
        $form['add_scene[title]'] = '';
        $form['add_scene[description]'] = 'test description';
        $form['add_scene[language][0]']->tick();
        $codeFile = $this->createTempCodeFile();
        $form['add_scene[codeFile]']->upload($codeFile);
        $imageFile = $this->createTempImageFile();
        $form['add_scene[imageFile][file]']->upload($imageFile);
        $this->client->submit($form);

        $this->assertResponseStatusCodeSame(200);
        $this->assertFormErrorDisplayed('The title is required.');

        // Clear tmp files
        unlink($codeFile->getRealPath());
        unlink($imageFile->getRealPath());
    }

    protected function tearDown(): void
    {
        $em = static::getContainer()->get('doctrine')->getManager();
        $em->createQuery('DELETE FROM App\Entity\AddScene')->execute();
        $em->createQuery('DELETE FROM App\Entity\User')->execute();

        $em->clear();
    
        parent::tearDown();
    }
}
