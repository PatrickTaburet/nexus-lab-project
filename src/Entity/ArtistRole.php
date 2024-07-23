<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\ArtistRoleRepository;

#[ORM\Entity(repositoryClass: ArtistRoleRepository::class)]
class ArtistRole
{
    public function __construct()
    {
        $this->createdAt = new DateTimeImmutable();
    }
    
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    private $id;

    #[ORM\Column(type: "string", length: 100)]
    private $firstname;

    #[ORM\Column(type: "string", length: 100)]
    private $name;

    #[ORM\Column(type: "text")]
    private $bio;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private $exemples;

    #[ORM\Column(type: "string", length: 255)]
    private $portfolio;

    #[ORM\Column(type: "datetime_immutable", nullable: true)]
    private $createdAt;

    #[ORM\OneToOne(targetEntity: User::class, inversedBy: "role_request")]
    #[ORM\JoinColumn(name: "user_id", referencedColumnName: "id")]
    private $user;
    

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFirstname(): ?string
    {
        return $this->firstname;
    }

    public function setFirstname(string $firstname): self
    {
        $this->firstname = $firstname;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(string $bio): self
    {
        $this->bio = $bio;

        return $this;
    }

    public function getExemples(): ?string
    {
        return $this->exemples;
    }

    public function setExemples(?string $exemples): self
    {
        $this->exemples = $exemples;

        return $this;
    }

    public function getPortfolio(): ?string
    {
        return $this->portfolio;
    }

    public function setPortfolio(string $portfolio): self
    {
        $this->portfolio = $portfolio;

        return $this;
    }
    public function getCreatedAt(): ?DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->createdAt = $updatedAt;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }
    

    public function setUser(?User $user): self
    {
        // unset the owning side of the relation if necessary
        if ($user === null && $this->user !== null) {
            $this->user->setRoleRequest(null);
        }

        // set the owning side of the relation if necessary
        if ($user !== null && $user->getRoleRequest() !== $this) {
            $user->setRoleRequest($this);
        }

        $this->user = $user;

        return $this;
    }

    public function getType(): string
    {
        return 'ArtistRole';
    }
}
