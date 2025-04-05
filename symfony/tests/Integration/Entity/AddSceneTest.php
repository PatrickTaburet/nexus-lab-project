<?php

namespace App\Tests\App\tests\Integration\Entity;

use App\Entity\AddScene;
use App\Entity\User;
use DateTimeImmutable;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class AddSceneTest extends KernelTestCase
{
    private User $user;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->user = $this->createUser();
    }
    
    private function createUser(): User
    {
        return (new User())
            ->setEmail(uniqid() . '@test.com')
            ->setPseudo('test_user')
            ->setRoles(['ROLE_USER'])
            ->setPassword('hashed-password');
    }

    private function createFakeImage(): UploadedFile
    {
        $filePath = tempnam(sys_get_temp_dir(), 'test_upload');
        file_put_contents($filePath, 'fake image content');
        return new UploadedFile(
            $filePath,
            'test.jpg',
            'image/jpeg',
            null,
            true
        );
    }

    public function testAddScenePersistence(): void
    {
        $em = self::getContainer()->get('doctrine')->getManager();

        $scene = (new AddScene())
            ->setTitle('Scene Title')
            ->setDescription('Test description')
            ->setLanguage(['php', 'js'])
            ->setCodeFile('example.php')
            ->setUser($this->user);

        $scene->setImageFile($this->createFakeImage());

        $em->persist($this->user);
        $em->persist($scene);
        $em->flush();
        $em->clear();

        $saved = $em->getRepository(AddScene::class)->findOneBy(['title' => 'Scene Title']);
        $savedUser = $em->getRepository(User::class)->findOneBy(['pseudo' => 'test_user']);

        $this->assertNotNull($saved);
        $this->assertSame('Test description', $saved->getDescription());
        $this->assertSame(['php', 'js'], $saved->getLanguage());
        $this->assertSame('example.php', $saved->getCodeFile());
        $this->assertSame($savedUser, $saved->getUser());
        $this->assertNotNull($saved->getImageName());
        $this->assertInstanceOf(DateTimeImmutable::class, $saved->getUpdatedAt());
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $em = self::getContainer()->get('doctrine')->getManager();
        $em->createQuery('DELETE FROM App\Entity\AddScene')->execute();
        $em->createQuery('DELETE FROM App\Entity\User')->execute();
        $em->clear();
    }
}
