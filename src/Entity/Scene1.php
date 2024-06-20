<?php

namespace App\Entity;

use DateTimeImmutable;
use Doctrine\ORM\Mapping as ORM;
use App\Repository\Scene1Repository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

/**
 * @ORM\Entity(repositoryClass=Scene1Repository::class)
 * @Vich\Uploadable
 */
class Scene1
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $color;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $saturation;

    /**
     * @ORM\Column(type="float")
     * @Groups ("sceneDataRecup")
     */
    private $opacity;

    /**
     * @ORM\Column(type="float")
     * @Groups ("sceneDataRecup")
     */
    private $weight;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $num_line;

    /**
     * @ORM\Column(type="float")
     * @Groups ("sceneDataRecup")
     */
    private $velocity;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $noiseOctave;

    /**
     * @ORM\Column(type="float")
     * @Groups ("sceneDataRecup")
     */
    private $noiseFalloff;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $comment;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="Scene1")
     * @ORM\JoinColumn(nullable=false)
     * @Groups ("sceneDataRecup")
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false)
     * @ORM\JoinTable("user_G1artwork_like")
     */
    private $likes;

    // --------- VICH UPLOADER-----------------

    /**
     * @Vich\UploadableField(mapping="scene1Images", fileNameProperty="imageName")
     * @var File|null
     */
    private $imageFile;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $imageName;

    /**
    * @ORM\Column(type="datetime_immutable", nullable=true)
    */
    private $updatedAt;

   

//-------------------------------------------------------------------------------------------

    public function __construct()
    {
        $this->likes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getColor(): ?int
    {
        return $this->color;
    }

    public function setColor(?int $color): self
    {
        $this->color = $color;

        return $this;
    }

    public function getSaturation(): ?int
    {
        return $this->saturation;
    }

    public function setSaturation(?int $saturation): self
    {
        $this->saturation = $saturation;

        return $this;
    }

    public function getOpacity(): ?float
    {
        return $this->opacity;
    }

    public function setOpacity(?float $opacity): self
    {
        $this->opacity = $opacity;

        return $this;
    }

    public function getWeight(): ?float
    {
        return $this->weight;
    }

    public function setWeight(?float $weight): self
    {
        $this->weight = $weight;

        return $this;
    }

    public function getNumLine(): ?int
    {
        return $this->num_line;
    }

    public function setNumLine(?int $num_line): self
    {
        $this->num_line = $num_line;

        return $this;
    }

    public function getVelocity(): ?float
    {
        return $this->velocity;
    }

    public function setVelocity(?float $velocity): self
    {
        $this->velocity = $velocity;

        return $this;
    }

    public function getNoiseOctave(): ?int
    {
        return $this->noiseOctave;
    }

    public function setNoiseOctave(?int $noiseOctave): self
    {
        $this->noiseOctave = $noiseOctave;

        return $this;
    }

    public function getNoiseFalloff(): ?float
    {
        return $this->noiseFalloff;
    }

    public function setNoiseFalloff(?float $noiseFalloff): self
    {
        $this->noiseFalloff = $noiseFalloff;

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

    // ---------- Vich Uploader - Screen Artwork ---------- //


    /**
     * If manually uploading a file (i.e. not using Symfony Form) ensure an instance
     * of 'UploadedFile' is injected into this setter to trigger the update. If this
     * bundle's configuration parameter 'inject_on_load' is set to 'true' this setter
     * must be able to accept an instance of 'File' as the bundle will inject one here
     * during Doctrine hydration.
     *
     * @param File|\Symfony\Component\HttpFoundation\File\UploadedFile|null $imageFile
     */
    public function setImageFile(?File $imageFile = null): void
    {
        $this->imageFile = $imageFile;

        if (null !== $imageFile) {
            // It is required that at least one field changes if you are using doctrine
            // otherwise the event listeners won't b    e called and the file is lost
            $this->updatedAt = new \DateTimeImmutable();
        }
    }

    public function getImageFile(): ?File
    {
        return $this->imageFile;
    }

    public function setImageName(?string $imageName): void
    {
        $this->imageName = $imageName;
    }

    public function getImageName(): ?string
    {
        return $this->imageName;
    }

    public function getUpdatedAt(): ?DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

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
        if (!$this->likes->contains($like)){
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
