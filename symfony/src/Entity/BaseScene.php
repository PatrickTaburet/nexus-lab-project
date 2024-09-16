<?php

namespace App\Entity;

use DateTimeImmutable;
use Symfony\Component\{
    HttpFoundation\File\File,
    Serializer\Annotation\Groups
};
use Doctrine\Common\Collections\{
    Collection,
    ArrayCollection
};
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Doctrine\ORM\Mapping as ORM;


#[ORM\MappedSuperclass]
#[Vich\Uploadable]
abstract class BaseScene
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: "integer")]
    #[Groups("sceneDataRecup")]
    protected $id;

    #[ORM\Column(type: "string", length: 100, nullable: true)]
    protected $title;

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    protected $comment;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[Groups("sceneDataRecup")]
    protected $user;
    
    #[ORM\ManyToMany(targetEntity: User::class)]
    protected $likes;

  // --------- VICH UPLOADER-----------------

    #[ORM\Column(type: "string", length: 255, nullable: true)]
    private $imageName;

//------------------------------------------------------------------------------------------


    public function __construct()
    {
        $this->likes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    // ---------- Vich Uploader - Screen Artwork ---------- //

    public function setImageName(?string $imageName): void
    {
        $this->imageName = $imageName;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    abstract public function getImageFile(): ?File;
    abstract public function setImageFile(?File $imageFile = null): void;

    abstract public function getUpdatedAt(): ?DateTimeImmutable;
    abstract public function setUpdatedAt(?DateTimeImmutable $updatedAt): self;

     // ---------- Likes settings ---------- //

    /**
     * @return Collection<int, likes>
     */
    public function getLikes(): Collection
    {
        return $this->likes;
    }

    public function addLike(User $like): self
    {
        if (!$this->likes->contains($like)) {
            $this->likes[] = $like;
        }
        return $this;
    }

    public function removeLike(User $like): self
    {
        $this->likes->removeElement($like);
        return $this;
    }

    public function isLikedByUser(User $user): bool
    {
        return $this->likes->contains($user);
    }
}
