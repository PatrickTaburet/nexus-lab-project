<?php

namespace App\Tests\Integration\Entity;

use App\Entity\ArtistRole;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ArtistRoleTest extends KernelTestCase
{
    // Fixtures 

    private function getValidUser(): User
    {
        return (new User())
            ->setEmail('artist@example.com')
            ->setPseudo('artist')
            ->setRoles(['ROLE_USER'])
            ->setPassword('hashed-password');
    }

    private function getEntity() : ArtistRole 
    {
        return (new ArtistRole())
            ->setFirstname('John')
            ->setName('Doe')
            ->setBio('Test Bio')
            ->setPortfolio('https://portfolio-test.com');
    }

    // Validation Helper

    private function assertHasErrors(ArtistRole $entity, int $expectedErrorCount = 0): void
    {
        self::bootKernel();
        $container = static::getContainer();
        $errors = $container->get('validator')->validate($entity);
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

    // Valid Cases

    public function testValidArtistRole(): void
    {
        $user = $this->getValidUser();
        $artist = $this->getEntity()->setUser($user);
        $this->assertHasErrors($artist, 0);
    }

    public function testCreatedAtIsInitializedOnConstruct(): void
    {
        $artist = new ArtistRole();
        $this->assertInstanceOf(\DateTimeImmutable::class, $artist->getCreatedAt());
    }

    public function testMaxLengthValidValues(): void
    {
        $artist = $this->getEntity()
            ->setFirstname(str_repeat('a', 100)) 
            ->setName(str_repeat('b', 100))
            ->setPortfolio(str_repeat('c', 255))
            ->setExemples(str_repeat('d', 255));
    
        $this->assertHasErrors($artist, 0);
    }

    // Validation: NotBlank Constraints

    public function testFirstnameNotBlank(): void
    {
        $artist = $this->getEntity()->setFirstname('');
        $this->assertHasErrors($artist, 1);
    }

    public function testNameNotBlank(): void
    {
        $artist = $this->getEntity()->setName('');
        $this->assertHasErrors($artist, 1);
    }

    public function testBioNotBlank(): void
    {
        $artist = $this->getEntity()->setBio('');
        $this->assertHasErrors($artist, 1);
    }

    public function testPortfolioNotBlank(): void
    {
        $artist = $this->getEntity()->setPortfolio('');
        $this->assertHasErrors($artist, 1);
    }

    // Validation: Length Constraints 

    public function testTooLongNameAndFirstName(): void
    {   
        $form = $this->getEntity()->setFirstname(str_repeat('a', 101)); // > 100 chars
        $form->setName(str_repeat('a', 101)); // > 100 chars
        $this->assertHasErrors($form, 2);
    }

    public function testTooLongBioAndPortfolio(): void
    {   
        $form = $this->getEntity()->setExemples(str_repeat('a', 256)); // > 250 chars
        $form->setPortfolio(str_repeat('a', 256)); // > 250 chars
        $this->assertHasErrors($form, 2);
    }

    // Doctrine Persistence 

    public function testPersistArtistRole(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();
    
        $artist = $this->getEntity();
        $em->persist($artist);
        $em->flush();
    
        $this->assertNotNull($artist->getId());
    }

    public function testArtistRoleUserRelationPersistsCorrectly(): void
    {
        self::bootKernel();
        $em = self::getContainer()->get('doctrine')->getManager();
    
        $user = $this->getValidUser();
        $artist = $this->getEntity()->setUser($user);
    
        $em->persist($user);
        $em->persist($artist);
        $em->flush();
        $em->clear();
    
        $savedUser = $em->getRepository(User::class)->findOneBy(['email' => 'artist@example.com']);
        
        $this->assertInstanceOf(User::class, $savedUser);
        $this->assertInstanceOf(ArtistRole::class, $savedUser->getRoleRequest());
        $this->assertEquals($artist->getFirstname(), $savedUser->getRoleRequest()->getFirstname());
    }
    
    // Cleanup
    
    protected function tearDown(): void
    {
        parent::tearDown();
        $em = self::getContainer()->get('doctrine')->getManager();
        $em->createQuery('DELETE FROM App\Entity\ArtistRole ar')->execute();
        $em->createQuery('DELETE FROM App\Entity\User u')->execute();
        $em->clear();
    }
}
