import * as React from 'react';
import Document, { NextDocumentContext } from 'next/document';
import { ServerStyleSheet, createGlobalStyle } from 'styled-components';
import * as AmpHtml from 'react-amphtml';

const Amp = require('react-amphtml/setup');
const { AmpScripts, AmpScriptsManager, headerBoilerplate } = Amp;

export default class MyDocument extends Document {

    static getInitialProps({ req = {}, renderPage }) {
        const ampScripts = new AmpScripts();
        const sheet = new ServerStyleSheet();

        const page = renderPage((App => props => (
            sheet.collectStyles((
                <AmpScriptsManager ampScripts={ampScripts}>
                    <App {...props} />
                </AmpScriptsManager>
            ))
        ))) || {};

        const ampScriptTags = ampScripts.getScriptElements();

        const ampStyleTag = (
            <style amp-custom="" dangerouslySetInnerHTML={{
                __html: sheet.getStyleElement().reduce(
                    (css, jsx) => {
                        const { props: { dangerouslySetInnerHTML: { __html = '' } = {} } = {} } = {} = jsx;
                        return (
                            `${css}${__html}`
                        )
                    },
                    '',
                ),
            }} />
        );

        const title = (
            (page.head || []).filter(({ type }) => type === 'title').slice(0, 1) ||
            <title>ampreact</title>
        );

        return {
            ...page,
            title,
            url: req.url,
            ampScriptTags,
            ampStyleTag,
        };
    }

    render() {
        const {
            title,
            url,
            ampScriptTags,
            ampStyleTag,
            html
        } = this.props;

        return (
            <AmpHtml.Html specName="html ⚡ for top-level html" lang="en">
                <head>
                    {title}
                    {headerBoilerplate(url)}
                    {ampScriptTags}
                    {ampStyleTag}
                </head>
                <body dangerouslySetInnerHTML={{ __html: html }} />
            </AmpHtml.Html>
        );
    }
}