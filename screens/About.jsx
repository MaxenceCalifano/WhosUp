import { View, Text } from "react-native";

function About() {
    return (
        <View style={{ gap: 50, padding: 20 }}>
            <View>
                <Text style={{ fontWeight: "bold" }}>
                    Remarques / suggestion :
                </Text>
                <Text>
                    Si vous avez des suggestions ou remarques vous pouvez écrire à l'adresse e-mail : vantivities@gmail.com
                </Text>
                <Text style={{ fontWeight: "bold", marginTop: 10 }}>Données personnelles:</Text>
                <Text>Vantivities ne partage aucune de vos données avec des tiers, si vous souhaitez faire supprimer vos données ou supprimer complètement votre compte, vous pouvez écrire à l'adresse vantivities@gmail.com</Text>
            </View>

            <View style={{ gap: 10 }}>
                <Text style={{ fontWeight: "bold" }}>Crédits photos:</Text>
                <Text>L'image représentant l'activité randonné est de Eric Sanman: https://www.pexels.com/fr-fr/photo/groupe-de-personnes-marchant-en-montagne-1365425/</Text>
                <Text>L'image représentant l'activité Apéro est de Kindel Media: https://www.pexels.com/fr-fr/photo/toast-soleil-couchant-plage-mains-7148673/</Text>
                <Text>L'image représentant l'activité Jeux de société est de KoolShooters  : https://www.pexels.com/fr-fr/photo/plage-vacances-sable-amis-8974501/</Text>
                <Text>L'image représentant l'activité Autre est de Dcstudio : https://fr.freepik.com/auteur/dcstudio</Text>
            </View>
        </View>
    );
}

export default About;