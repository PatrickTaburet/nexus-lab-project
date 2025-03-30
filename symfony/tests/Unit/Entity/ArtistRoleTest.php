<?php

namespace App\Tests\Unit\Entity;

use DateTimeImmutable;
use App\Entity\ArtistRole;
use App\Entity\User;
use PHPUnit\Framework\TestCase;

class ArtistRoleTest extends TestCase
{
    public function testConstructorInitializesProperties(): void
    {
        $artistRole = new ArtistRole();
        $this->assertInstanceOf(DateTimeImmutable::class, $artistRole->getCreatedAt());
    }

    public function testSetUserAssignsBidirectionalRelation(): void
    {
        $artistRole = new ArtistRole();
        $user = new User();
    
        $artistRole->setUser($user);
    
        $this->assertSame($user, $artistRole->getUser());
        $this->assertSame($artistRole, $user->getRoleRequest());
    }
    
    public function testSetUserNullRemovesBidirectionalRelation(): void
    {
        $artistRole = new ArtistRole();
        $user = new User();
    
        $artistRole->setUser($user);
        $artistRole->setUser(null);
    
        $this->assertNull($artistRole->getUser());
        $this->assertNull($user->getRoleRequest());
    }

    public function testGetTypeReturnsExpectedValue(): void
    {
        $role = new ArtistRole();
        $this->assertSame('ArtistRole', $role->getType());
    }
}
