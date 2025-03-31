<?php

namespace App\Tests\Integration\Entity;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use App\Entity\ArtistRole;

class UserTest extends KernelTestCase
{
    public function getEntity() : User 
    {
        return (new User())->setEmail("test@mail.com")
            ->setPseudo('test')
            ->setRoles(['ROLE_TEST'])
            ->setPassword('hashed-password');
    }

    public function assertHasErrors(User $user, int $expectedErrorCount = 0)
    {
        self::bootKernel();
        $container = static::getContainer();
        $errors = $container->get('validator')->validate($user);
        if (count($errors) !== $expectedErrorCount) {
            foreach ($errors as $error) {
                echo sprintf(
                    "\nViolation on property '%s': %s",
                    $error->getPropertyPath(),
                    $error->getMessage()
                );
            }
        }
    
        $this->assertCount($expectedErrorCount, $errors);
    }

    public function testValidEntity(): void
    {
        $user = $this->getEntity();
        $this->assertHasErrors($user, 0);
    }

    public function testPersistValidUser(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();
    
        $user = $this->getEntity();
    
        $em->persist($user);
        $em->flush();
    
        $this->assertNotNull($user->getId(), 'Expected user to be persisted and have an ID.');
    }
    
    // Email
    public function testInvalidEmail(): void
    {
        $user = $this->getEntity()->setEmail('invalid_email');
        $this->assertHasErrors($user, 1);
    }

    public function testInvalidBlankEmail(): void
    {
        $user = $this->getEntity()->setEmail('');
        $this->assertHasErrors($user, 1);
    }

    public function testInvalidDuplicateEmail(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();
    
        $user1 = $this->getEntity();
        $em->persist($user1);
        $em->flush();
    
        $user2 = $this->getEntity(); // same email
        $this->assertHasErrors($user2, 1);
    }

    public function testPersistDuplicateEmailThrowsException(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();

        $user1 = $this->getEntity();
        $em->persist($user1);
        $em->flush();

        $user2 = $this->getEntity(); // same email

        $this->expectException(\Doctrine\DBAL\Exception\UniqueConstraintViolationException::class);

        $em->persist($user2);
        $em->flush(); // should throw
    }
    
    // Pseudo
    public function testTooShortPseudo(): void
    {
        $user = $this->getEntity()->setPseudo('a');
        $this->assertHasErrors($user, 1);
    }

    public function testTooLongPseudo(): void
    {   
        $user = $this->getEntity()->setPseudo(str_repeat('a', 51));
        $this->assertHasErrors($user, 1);
    }

    public function testInvalidBlankPseudo(): void
    {
        $user = $this->getEntity()->setPseudo('');

        $this->assertHasErrors($user, 2);
    }

    // Password
    public function testMissingPassword(): void
    {
        $user = $this->getEntity()->setPassword('');
        $this->assertHasErrors($user, 1);
    }

    // ImageFile
    public function testInvalidFileMimeType(): void
    {
        $user = $this->getEntity();

        $tmpPath = tempnam(sys_get_temp_dir(), 'test_upload');
        file_put_contents($tmpPath, 'fake image');
        $file = new UploadedFile(
            $tmpPath,
            'test.txt',
            'text/plain',
            null,
            true
        );

        $user->setImageFile($file);
        $this->assertHasErrors($user, 1);

        unlink($tmpPath);
    }


    public function testUserAndRoleRequestRelation(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();
    
        $user = $this->getEntity();
        $roleRequest = new ArtistRole();
    
        $roleRequest->setUser($user)
            ->setFirstname('John')
            ->setName('Doe')
            ->setBio('test bio')
            ->setPortfolio('test portfolio');

        $user->setRoleRequest($roleRequest);
    
        $em->persist($user);
        $em->persist($roleRequest);
        $em->flush();
        $em->clear();
    
        $savedRole = $em->getRepository(ArtistRole::class)->findOneBy([]);
        $this->assertInstanceOf(ArtistRole::class, $savedRole);
        $this->assertInstanceOf(User::class, $savedRole->getUser());
        $this->assertEquals('test@mail.com', $savedRole->getUser()->getEmail());
    }

    //Clear Test DataBase
    protected function tearDown(): void
    {
        parent::tearDown();

        $em = self::getContainer()->get('doctrine')->getManager();
        $em->createQuery('DELETE FROM App\Entity\ArtistRole ar')->execute();
        $em->createQuery('DELETE FROM App\Entity\User u')->execute();
        $em->clear();
    }

}
