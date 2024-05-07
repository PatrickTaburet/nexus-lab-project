<?php

namespace App\Form;

use App\Entity\AddScene;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;

class AddSceneType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('language')
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
