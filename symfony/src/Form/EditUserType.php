<?php

namespace App\Form;

use Vich\UploaderBundle\Form\Type\VichImageType;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\OptionsResolver\OptionsResolver;
use App\Entity\User;
use Symfony\Component\Form\{
    AbstractType,
    FormBuilderInterface
};
use Symfony\Component\Form\Extension\Core\Type\{
    TextType,
    ChoiceType,
    SubmitType,
    EmailType
};


class EditUserType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
       
        $builder
            ->add('pseudo', TextType::class,[
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => ' '
                ]
            ])
            ->add('email', EmailType::class,[
                'constraints' =>[
                    new NotBlank([
                        'message' => 'Please enter an email adress'
                    ])
                ],
                'required' => true,
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => ' '

                ]
            ])
           
            ->add('imageFile', VichImageType::class, [
                'label' => 'User picture',
                'allow_delete' => false, 
                'download_link' => false,
                'image_uri' => true,
                'label_attr' => [
                    'class' => 'labelImg'
                ],
                'required' => false , // image is required only if the form is used for create
            ])
           
            -> add('Submit', SubmitType::class, [
                'label' => 'Update',
                'attr' => [
                    'class' => 'customButton',
                ],
            ])
        ;
        
        if ($options['is_admin']){
            $builder ->add('roles', ChoiceType::class, [
                'choices' => [
                    'User' => 'ROLE_USER',
                    'Artist' => 'ROLE_ARTIST',
                    'Admin' => 'ROLE_ADMIN'
                ],
                'expanded' => true,
                'multiple' => true,
                'label' => 'Roles'
            ]);
        }
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'is_admin' => false,
        ]);
    }
}
