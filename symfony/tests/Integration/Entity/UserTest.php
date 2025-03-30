<?php

namespace App\Tests\Integration\Entity;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class UserTest extends KernelTestCase
{
    public function getEntity() : User 
    {
        return (new User())->setEmail("test@mail.com")
            ->setPseudo('test')
            ->setRoles(['ROLE_TEST'])
            ->setPassword('hashed-password');
    }

    public function assertHasErrors(User $user, int $number = 0)
    {
        self::bootKernel();
        $container = static::getContainer();
        $errors = $container->get('validator')->validate($user);
        $this->assertCount($number, $errors);

    }

    public function testValidEntity(): void
    {
        $user = $this->getEntity();
        $this->assertHasErrors($user, 0);
    }
}
