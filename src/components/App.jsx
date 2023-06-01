import { Component } from 'react';
import ContactForm from './ContactForm/ContactForm';
import Contacts from './Contacts/Contacts';
import Filter from './Filter/Filter';
import { WrapperContent } from './App.styled';
import { nanoid } from 'nanoid';
import Notiflix from 'notiflix';
import initialContacts from '../contacts.json'

export class App extends Component {
  state = {
    contacts: initialContacts,
    name: '',
    number: '',
    filter: '',
  };

  creatContact = data => {
    const { name, number } = data;
    const contact = {
      name: name,
      number: number,
      id: nanoid(),
    };

    if (
      this.state.contacts.find(
        existingContact => existingContact.name === contact.name
      )
    ) {
      Notiflix.Notify.failure(`${contact.name} is already in your contacts`);
    } else {
      this.setState(prevState => ({
        contacts: [contact, ...prevState.contacts],
      }));
      Notiflix.Notify.success(
        `${contact.name} has been successfully added to  your phonebook`
      );
    }
  };

  deleteContact = contactId => {
    this.setState(prevState => ({
      contacts: prevState.contacts.filter(contact => contact.id !== contactId),
    }));
  };

  getFiltredContacts = () => {
    const { contacts, filter } = this.state;

    const filtredContacts = contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
    return filtredContacts;
  };
  hadleFilterChange = e => {
    this.setState({ filter: e.target.value });
  };

	
	componentDidUpdate(_, prevState) {
		if (this.state.contacts !== prevState.contacts) {
			localStorage.setItem('contacts', JSON.stringify(this.state.contacts))
		}
	}

	componentDidMount() {
		const savedContacts = localStorage.getItem('contacts');
		const parsedContacts = JSON.parse(savedContacts);
		if(parsedContacts) 	this.setState({contacts: parsedContacts})
	
	}
  render() {
    return (
      <WrapperContent>
        <ContactForm creatContact={this.creatContact} />
        <Contacts
          deleteContact={this.deleteContact}
          contacts={this.getFiltredContacts()}
        ></Contacts>
        <Filter
          value={this.state.filter}
          onChange={this.hadleFilterChange}
        ></Filter>
      </WrapperContent>
    );
  }
}
