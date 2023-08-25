import "@/styles/globals.css";
// import Layout from "@/components/Layout.js"; 

function App( { Component, pageProps } ) {

    return (
        // <Layout>
            <Component { ...pageProps } />
        // </Layout>
    );
}

export default App;
