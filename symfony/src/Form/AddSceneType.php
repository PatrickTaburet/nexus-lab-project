<?php

namespace App\Form;

use Vich\UploaderBundle\Form\Type\VichImageType;
use App\Entity\AddScene;
use Symfony\Component\{
    Form\AbstractType,
    Form\FormBuilderInterface,
    Validator\Constraints\File,
    OptionsResolver\OptionsResolver
};
use Symfony\Component\Form\Extension\Core\Type\{
    FileType,
    TextType,
    ChoiceType,
    SubmitType
};
use Symfony\Component\Validator\Constraints\NotBlank;

class AddSceneType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('language', ChoiceType::class,[
                'choices' => [
                    'P5JS' => 'p5js',
                    'JavaScript' => 'javascript',
                    'Python' => 'python',
                    'GLSL / WebGl' => 'glsl / webgl',
                    'Other' => 'other',
                ],
                'required' => false,
                'multiple' => true,
                'expanded' => true,
            ])
            ->add('otherLanguage', TextType::class, [
                'mapped' => false,
                'required' => false,
                'attr' => [
                    'placeholder' => "Other Language"
                ],
            ])
            ->add('title', TextType::class, [
                'required' => false, 
            ])
            ->add('description', TextType::class, [
                'required' => false, 
            ])
            ->add('codeFile', FileType::class, [
                'label' => 'Code file',
                'mapped' => false,
                'label_attr' => [
                    'class' => 'img-label '
                ],
                'required' => false,
                'constraints' => [
                    // new NotBlank(['message' => 'A code file is required.']),
                    new File([
                        'maxSize' => '1024k',
                        'mimeTypes' => [ 
                            'text/plain',
                        ],
                        'mimeTypesMessage' => 'Please upload a valid text file',
                    ])
                ],
            ])
            ->add('imageFile', VichImageType::class, [
                'label' => 'Scene Screenshot',
                'allow_delete' => false, 
                'download_link' => false,
                'label_attr' => [
                    'class' => 'img-label '
                ],
                'required' => false,
                'constraints' => [
                    new NotBlank(['message' => 'Please upload an image.']),
                    new File([
                        'mimeTypes' => [
                            'image/jpeg',
                            'image/png',
                            'image/gif',
                        ],
                        'mimeTypesMessage' => 'Please upload a valid image file',
                    ])
                ],
            ])
            ->add('submit', SubmitType::class, [
                'label' => 'Submit',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => AddScene::class,
        ]);
    }
}
