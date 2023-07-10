import { View, Text } from "react-native";

function About() {
    return (
        <View style={{ gap: 50, padding: 20 }}>
            <Text>
                Si vous avez des suggestions ou remarques vous pouvez écrire à l'adresse e-mail : maxence.califano@gmail.com
            </Text>
            <View style={{ gap: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Crédits photos:</Text>
                <Text>L'image représant l'activité randonné est de Eric Sanman: https://www.pexels.com/fr-fr/photo/groupe-de-personnes-marchant-en-montagne-1365425/</Text>
                <Text>L'image représant l'activité Apéro est de Kindel Media: https://www.pexels.com/fr-fr/photo/toast-soleil-couchant-plage-mains-7148673/</Text>
                <Text>L'image représant l'activité Jeux de société est de KoolShooters  : https://www.pexels.com/fr-fr/photo/plage-vacances-sable-amis-8974501/</Text>
                <Text>L'image représant l'activité Autre est de Dcstudio : https://fr.freepik.com/auteur/dcstudio</Text>
            </View>
        </View>
    );
}

export default About;