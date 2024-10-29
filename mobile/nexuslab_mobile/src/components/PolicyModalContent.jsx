import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {colors} from '../utils/colors'

const PolicyModalContent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>NexusLab Privacy Policy</Text>
      <Text style={styles.paragraph}>
        NexusLab operates the www.nexuslab.com website, which provides the SERVICE.
      </Text>

      <Text style={styles.paragraph}>
        This page is used to inform website visitors regarding our policies with the collection, use, 
        and disclosure of Personal Information if anyone decided to use our Service, the NexusLab website.
      </Text>

      <Text style={styles.paragraph}>
        If you choose to use our Service, then you agree to the collection and use of information in 
        relation with this policy. The Personal Information that we collect is used for providing and 
        improving the Service. We will not use or share your information with anyone except as described 
        in this Privacy Policy.
      </Text>

      <Text style={styles.sectionTitle}>Information Collection and Use</Text>
      <Text style={styles.paragraph}>
        For a better experience while using our Service, we may require you to provide us with certain 
        personally identifiable information, including but not limited to your name and postal address. 
        The information that we collect will be used to contact or identify you.
      </Text>

      <Text style={styles.sectionTitle}>Intellectual Property and Usage Rights</Text>
      <Text style={styles.paragraph}>
        All artworks generated on NexusLab are free of rights and are considered open and public domain. 
        Users are free to share, modify, and distribute the generated creations without restrictions. 
        By using NexusLab, you acknowledge that any creations produced on the platform are publicly available 
        and not subject to copyright.
      </Text>

      <Text style={styles.sectionTitle}>Log Data</Text>
      <Text style={styles.paragraph}>
        We want to inform you that whenever you visit our Service, we collect information that your 
        browser sends to us that is called Log Data. This Log Data may include information such as your 
        computer's Internet Protocol ("IP") address, browser version, pages of our Service that you visit, 
        the time and date of your visit, the time spent on those pages, and other statistics.
      </Text>

      <Text style={styles.sectionTitle}>Cookies</Text>
      <Text style={styles.paragraph}>
        In the future, this site may use cookies, small files containing anonymous data often used for unique 
        visitor identification. These cookies would be sent to your browser by our website and stored on 
        your device. We will request your permission before enabling them.
      </Text>

      <Text style={styles.sectionTitle}>Service Providers</Text>
      <Text style={styles.paragraph}>
        We may employ third-party companies and individuals due to the following reasons:
      </Text>
      <Text style={styles.listItem}>- To facilitate our Service;</Text>
      <Text style={styles.listItem}>- To provide the Service on our behalf;</Text>
      <Text style={styles.listItem}>- To perform Service-related services;</Text>
      <Text style={styles.listItem}>- To assist us in analyzing how our Service is used.</Text>

      <Text style={styles.sectionTitle}>Security</Text>
      <Text style={styles.paragraph}>
        We value your trust in providing us your Personal Information, thus we are striving to use 
        commercially acceptable means of protecting it. But remember that no method of transmission over 
        the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee 
        its absolute security.
      </Text>

      <Text style={styles.sectionTitle}>Links to Other Sites</Text>
      <Text style={styles.paragraph}>
        Our Service may contain links to other sites. If you click on a third-party link, you will be 
        directed to that site. Note that these external sites are not operated by us. Therefore, we 
        strongly advise you to review the Privacy Policy of these websites. We have no control over, 
        and assume no responsibility for the content, privacy policies, or practices of any third-party 
        sites or services.
      </Text>

      <Text style={styles.sectionTitle}>Changes to This Privacy Policy</Text>
      <Text style={styles.paragraph}>
        We may update our Privacy Policy from time to time. Thus, we advise you to review this page 
        periodically for any changes. We will notify you of any changes by posting the new Privacy Policy 
        on this page. These changes are effective immediately, after they are posted on this page.
      </Text>

      <Text style={styles.sectionTitle}>Contact Us</Text>
      <Text style={styles.paragraph}>
        If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us.
      </Text>
    </View>
  );
};

export default PolicyModalContent;

const styles = StyleSheet.create({
    container: {
      padding: 16,
      backgroundColor: colors.purple_dark,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginVertical: 20,
      color: colors.cyan
    },
    paragraph: {
      fontSize: 14,
      lineHeight: 24,
      marginBottom: 12,
      color: colors.web_white
    },
    listItem: {
      fontSize: 14,
      marginBottom: 6,
      marginLeft: 16,
      color: colors.web_white
    },
  });
