import UserList from '../../components/ui/UserList';

const Users = () => {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <p className="text-muted-foreground">Información de los usuarios</p>
      </header>
      <section>
        <UserList />
      </section>
    </>
  );
};

export default Users;
