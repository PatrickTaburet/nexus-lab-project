<?php

namespace App\Tests\Unit\Entity;

use App\Entity\User;
use Doctrine\Common\Collections\Collection;
use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function testConstructorInitializesProperties(): void
    {
        $user = new User();
        $this->assertInstanceOf(\DateTimeImmutable::class, $user->getCreatedAt());
        $this->assertEquals('no-profile.jpg', $user->getImageName());
        $this->assertNull($user->getImageFile());
        $this->assertInstanceOf(Collection::class, $user->getScene1());
        $this->assertInstanceOf(Collection::class, $user->getScene2());
        $this->assertInstanceOf(Collection::class, $user->getSceneD1());
        $this->assertInstanceOf(Collection::class, $user->getSceneD2());
        $this->assertInstanceOf(Collection::class, $user->getAddScene());
        $this->assertInstanceOf(Collection::class, $user->getCollectiveDrawing());
    }

    public function testUserIdentifierAndUsername(): void
    {
        $user = new User();
        $email = 'test@example.com';
        $user->setEmail($email);

        $this->assertEquals($email, $user->getUserIdentifier());
    }

    public function testRolesAlwaysIncludeRoleUser(): void
    {
        $user = new User();

        // When no role is defined, ROLE_USER must always be present
        $user->setRoles([]);
        $this->assertContains('ROLE_USER', $user->getRoles());

        // When defining other roles, ROLE_USER should be added automatically
        $user->setRoles(['ROLE_ADMIN']);
        $this->assertContains('ROLE_ADMIN', $user->getRoles());
        $this->assertContains('ROLE_USER', $user->getRoles());
    }
    
}
