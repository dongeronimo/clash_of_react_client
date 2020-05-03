
import Adapter from 'enzyme-adapter-react-16';
import React from 'react'
import Enzyme, { mount, ReactWrapper } from 'enzyme'
import ExampleComponent from './ExampleComponent';


Enzyme.configure({ adapter: new Adapter() });

describe('Tests are working', ()=>{
    it('works in a simple test', ()=>{
        expect(1).toBe(1);
    })
    it('works testing a component', ()=>{
        const wrapper:ReactWrapper = mount(<ExampleComponent value={10}/>);
        expect(wrapper.length).toBe(1);
        expect(wrapper.findWhere(n=>n.text().includes("Valor = 10")).length).toBeGreaterThan(0);
    })
})