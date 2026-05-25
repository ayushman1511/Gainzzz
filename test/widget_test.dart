import 'package:flutter_test/flutter_test.dart';
import 'package:gainzzz/main.dart';
import 'package:network_image_mock/network_image_mock.dart';

void main() {
  testWidgets('GainsApp builds and boots splash screen', (WidgetTester tester) async {
    await mockNetworkImagesFor(() async {
      // Build our app and trigger a frame.
      await tester.pumpWidget(const GainsApp());

      // Verify that the splash screen shows NEURAL SYNC
      expect(find.text('NEURAL SYNC'), findsOneWidget);
      
      // Verify that the splash screen shows INITIALIZE LINK button
      expect(find.text('INITIALIZE LINK'), findsOneWidget);
    });
  });
}
