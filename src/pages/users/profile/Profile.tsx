import { useForm, SubmitHandler } from 'react-hook-form'

type ProfileForm = {
  name: string
  email: string
}

const Profile = () => {
  const { register, handleSubmit } = useForm<ProfileForm>()
  const onSubmit: SubmitHandler<ProfileForm> = (data) => {
    console.log(data)
  }

  return (
    <div className='container'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Name</label>
          <input type="text" {...register('name')} />
        </div>
        <div>
          <label>Email</label>
          <input type="email" {...register('email')} />
        </div>
        <div>
          <input type="submit" value="enviar form" />
        </div>
      </form>
    </div>
  )
}

export default Profile
