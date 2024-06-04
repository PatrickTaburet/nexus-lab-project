<?php

namespace App\Form;

use App\Entity\AddScene;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Vich\UploaderBundle\Form\Type\VichImageType;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;

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
            ->add('title')
            ->add('description')
            ->add('codeFile', FileType::class, [
                'label' => 'Code file',
                'mapped' => false,
                'constraints' => [
                    new File([
                        'maxSize' => '1024k',
                        'mimeTypes' => [ 
                            'text/plain', // Only accept .txt files
                        ],
                        'mimeTypesMessage' => 'Please upload a valid text file',
                    ])
                ],
            ])
            ->add('imageFile', VichImageType::class, [
                'label' => 'Scene Screenshot',
                'label_attr' => [
                    'class' => 'img-label '
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
