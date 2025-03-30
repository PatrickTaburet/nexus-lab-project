<?php

namespace App\Tests\Unit\Entity;

use App\Entity\RefreshToken;
use PHPUnit\Framework\TestCase;

class RefreshTokenTest extends TestCase
{
    public function testConstructorInitializesProperties(): void
    {
        $token = new RefreshToken('abc123', 'user');

        $this->assertEquals('abc123', $token->getRefreshToken());
        $this->assertEquals('user', $token->getUsername());
        
        $this->assertInstanceOf(\DateTimeImmutable::class, $token->getValid());
        
        // Assert the valid date is set 30 days in the future (allowing a 1-day margin for timing)
        $this->assertGreaterThan(new \DateTimeImmutable('+29 days'), $token->getValid()); 
    }

    public function testIsValidTokenOnConstruction(): void
    {
        $token = new RefreshToken('abc123', 'user');
        $this->assertTrue($token->isValid(), 'Expected isValid() to return true just after construction');
    }

    public function testIsValidReturnsFalseForPastDate(): void
    {
        $token = new RefreshToken('expiredToken', 'user');
        $reflection = new \ReflectionProperty(RefreshToken::class, 'valid');
        $reflection->setAccessible(true);
        $reflection->setValue($token, new \DateTimeImmutable('-1 day'));
        $this->assertFalse($token->isValid(), 'Expected isValid() to return false for past date');
    }


}
