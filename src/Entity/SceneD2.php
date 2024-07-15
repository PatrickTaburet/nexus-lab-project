<?php

namespace App\Entity;


use DateTimeImmutable;
use App\Repository\SceneD2Repository;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=SceneD2Repository::class)
 * @Vich\Uploadable
 */
class SceneD2
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
    private $divFactor;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $copy;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $deformation;

    /**
     * @ORM\Column(type="float")
     * @Groups ("sceneDataRecup")
     */
    private $sizeFactor;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $angle;

    /**
     * @ORM\Column(type="float")
     * @Groups ("sceneDataRecup")
     */
    private $opacity;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $filters;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $division;

    /**
     * @ORM\Column(type="integer")
     * @Groups ("sceneDataRecup")
     */
    private $colorRange;

    /**
     * @ORM\Column(type="boolean")
     * @Groups ("sceneDataRecup")
     */
    private $glitch;

    /**
     * @ORM\Column(type="boolean")
     * @Groups ("sceneDataRecup")
     */
    private $noise;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="sceneD2")
     * @ORM\JoinColumn(nullable=false)
     * @Groups ("sceneDataRecup")
     */
    private $user;

    /**
     * @ORM\ManyToMany(targetEntity=User::class)
     * @ORM\JoinColumn(nullable=false)
     * @ORM\JoinTable("user_D2artwork_like")
     */
    private $likes;

    /**
     * @ORM\Column(type="string", length=100, nullable=true)
     */
    private $title;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $comment;
 
    // --------- VICH UPLOADER-----------------

    /**
     * @Vich\UploadableField(mapping="sceneD2Images", fileNameProperty="imageName")
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

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $colorsValue;

    

    //-------------------------------------------------------------------------------------------

    public function __construct()
    {
        $this->likes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDivFactor(): ?int
    {
        return $this->divFactor;
    }

    public function setDivFactor(int $divFactor): self
    {
        $this->divFactor = $divFactor;

        return $this;
    }

    public function getCopy(): ?int
    {
        return $this->copy;
    }

    public function setCopy(int $copy): self
    {
        $this->copy = $copy;

        return $this;
    }

    public function getDeformation(): ?int
    {
        return $this->deformation;
    }

    public function setDeformation(int $deformation): self
    {
        $this->deformation = $deformation;

        return $this;
    }

    public function getSizeFactor(): ?float
    {
        return $this->sizeFactor;
    }

    public function setSizeFactor(float $sizeFactor): self
    {
        $this->sizeFactor = $sizeFactor;

        return $this;
    }

    public function getAngle(): ?int
    {
        return $this->angle;
    }

    public function setAngle(int $angle): self
    {
        $this->angle = $angle;

        return $this;
    }

    public function getOpacity(): ?float
    {
        return $this->opacity;
    }

    public function setOpacity(float $opacity): self
    {
        $this->opacity = $opacity;

        return $this;
    }

    public function getFilters(): ?int
    {
        return $this->filters;
    }

    public function setFilters(int $filters): self
    {
        $this->filters = $filters;

        return $this;
    }

    public function getDivision(): ?int
    {
        return $this->division;
    }

    public function setDivision(int $division): self
    {
        $this->division = $division;

        return $this;
    }

    public function getColorRange(): ?int
    {
        return $this->colorRange;
    }

    public function setColorRange(int $colorRange): self
    {
        $this->colorRange = $colorRange;

        return $this;
    }

    public function getGlitch(): ?int
    {
        return $this->glitch;
    }

    public function setGlitch(int $glitch): self
    {
        $this->glitch = $glitch;

        return $this;
    }

    public function getNoise(): ?int
    {
        return $this->noise;
    }

    public function setNoise(int $noise): self
    {
        $this->noise = $noise;

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

     // Likes settings

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

    public function getColorsValue(): ?string
    {
        return $this->colorsValue;
    }

    public function setColorsValue(string $colorsValue): self
    {
        $this->colorsValue = $colorsValue;

        return $this;
    }
}
