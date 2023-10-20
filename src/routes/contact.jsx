import { Form, useLoaderData } from 'react-router-dom';
import { getContact, updateContact } from '../components/contacts';
import Favorite from '../components/favorite';

export async function loader({ params }) {
    const contact = await getContact(params.contactId);

    if (!contact) {
        throw new Response('', {
            status: 404,
            statusText: 'Contact Not Found'
        });
    }

    return { contact };
}

export async function action({ request, params }) {
    let formData = await request.formData();

    return updateContact(params.contactId, {
        favorite: formData.get('favorite') === 'true'
    });
}

export default function Contact() {
    const { contact } = useLoaderData();

    // const contact = {
    //     first: 'Robert',
    //     last: 'Smith',
    //     avatar: 'https://placekitten.com/g/200/200',
    //     twitter: 'https://twitter.com',
    //     notes: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ',
    //     favorite: true
    // };

    return (
        <div id="contact">
            <div>
                <img
                    key={contact.avatar}
                    src={contact.avatar || null}
                />
            </div>
            <div>
                <h1>
                    {contact.first || contact.last ? (
                        <>
                        {contact.first} {contact.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite contact={contact} />
                </h1>

                {contact.twitter && (
                    <p>
                        <a
                            target="_blank"
                            href={`https://twitter.com/${contact.twitter}`}
                            rel="noreferrer">
                            {contact.twitter}
                        </a>
                    </p>
                )}

                {contact.notes && <p>{contact.notes}</p>}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>
                    <Form
                        method="post"
                        action="destroy"
                        onSubmit={(event) => {
                            if (
                              !confirm(
                                'Please confirm you want to delete this record.'
                              )
                            ) {
                              event.preventDefault();
                            }
                        }}>
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    )
}