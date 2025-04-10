<?php

namespace App\Entity;

use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\RefreshTokenRepository;


#[ORM\Entity(repositoryClass: RefreshTokenRepository::class)]
#[ORM\Table(name: 'refresh_token')]
class RefreshToken
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $refresh_token = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $username = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $valid = null;

    public function __construct($refresh_token, $username)
    {
        $this->refresh_token = $refresh_token;
        $this->username = $username;
        $this->valid = new \DateTimeImmutable('+30 days');
    }

    public function isValid(): bool
    {
        return $this->valid > new \DateTimeImmutable();
    }

    public function getValid(): ?\DateTimeImmutable
    {
        return $this->valid;
    }
    
    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRefreshToken(): ?string
    {
        return $this->refresh_token;
    }

    public function setRefreshToken(?string $refresh_token): static
    {
        $this->refresh_token = $refresh_token;
        return $this;
    }
    public function getUsername(): ?string
    {
        return $this->username;
    }
    
    public function setUsername(?string $username): static
    {
        $this->username = $username;
        return $this;
    }
}
