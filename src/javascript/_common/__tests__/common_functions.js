import {expect} from 'chai';
import { JSDOM } from "jsdom";
import { makeOption, elementTextContent, selectorExists, elementInnerHtml, dateValueChanged} from '../common_functions';

describe('CommonFunctions', () => {
    let date_element,
        text_element,
        invalid_element;

    beforeAll(() => {
        const div = document.createElement('div');
        const input = document.createElement('input');
        input.setAttribute('data-value', '2017-06-21');
        input.setAttribute('value', '2017-06-21');
        input.setAttribute('type', 'date');

        const body = document.querySelector('body');
        body.append(div);
        body.append(input);


        text_element    = window.document.querySelector('div');
        invalid_element = window.document.getElementById('invalid');
    });

    describe('.makeOption()', () => {
        it('creates option as expected', () => {
            const option = makeOption({ text: 'Please select' });
            expect(option.textContent).to.eq('Please select');
            expect(option.value).to.eq('');
            expect(option.disabled).to.eq(false);
            expect(option.className).to.eq('');
            expect(option.selected).to.eq(false);
        });
        it('creates disabled option as expected', () => {
            const option = makeOption({
                text       : 'Text',
                value      : 'text',
                class      : 'text',
                is_disabled: 'disabled',
                is_selected: true,
            });
            expect(option.textContent).to.eq('Text');
            expect(option.value).to.eq('text');
            expect(option.className).to.eq('text');
            expect(option.disabled).to.eq(true);
            expect(option.selected).to.eq(true);
        });
    });

    describe('.dateValueChanged()', () => {
        beforeEach(() => {
            date_element = window.document.querySelector('input');
        });
        it('detects value hasn\'t changed', () => {
            expect(dateValueChanged(date_element, 'date')).to.eq(false);
        });
        it('detects value has changed', () => {
            date_element.value = '2017-06-22';
            expect(dateValueChanged(date_element, 'date')).to.eq(true);
        });
        it('correctly updates data-value to new value', () => {
            expect(date_element.getAttribute('data-value')).to.eq(date_element.value);
        });
    });

    describe('.selectorExists()', () => {
        it('detects valid selector exists', () => {
            expect(selectorExists(date_element)).to.eq(true);
        });
        it('detects invalid selector doesn\'t exist', () => {
            expect(selectorExists(invalid_element)).to.eq(false);
        });
    });

    describe('.elementTextContent()', () => {
        it('sets and gets textContent', () => {
            elementTextContent(text_element, 'Test<span></span>');
            expect(elementTextContent(text_element)).to.eq('Test<span></span>');
        });
    });

    describe('.elementInnerHtml()', () => {
        it('sets and gets innerHTML', () => {
            expect(elementInnerHtml(text_element)).to.eq('Test&lt;span&gt;&lt;/span&gt;');
            elementInnerHtml(text_element, 'Test<span></span>');
            expect(elementInnerHtml(text_element)).to.eq('Test<span></span>');
        });
    });
});
