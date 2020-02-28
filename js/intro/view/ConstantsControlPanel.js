// Copyright 2017-2020, University of Colorado Boulder

/**
 * Panel responsible for keeping the spring constant and spring thickness constant.
 * This panel should only be visible when in scene with adjustable spring length.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import merge from '../../../../phet-core/js/merge.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Text from '../../../../scenery/js/nodes/Text.js';
import VBox from '../../../../scenery/js/nodes/VBox.js';
import AquaRadioButton from '../../../../sun/js/AquaRadioButton.js';
import MassesAndSpringsConstants from '../../common/MassesAndSpringsConstants.js';
import massesAndSpringsStrings from '../../masses-and-springs-strings.js';
import massesAndSprings from '../../massesAndSprings.js';

const springConstantString = massesAndSpringsStrings.springConstant;
const thicknessString = massesAndSpringsStrings.thickness;

// constants
const TITLE_FONT = MassesAndSpringsConstants.LABEL_FONT;
const RADIO_BUTTON_SPACING = 4;

/**
 * @param {Property.<string>} selectedConstantProperty - determines which value to hold constant
 * @param {Enumeration} constantEnumeration - Choices for constant parameter
 * @param {string} title - string used to title the panel
 * @param {tandem} tandem
 * @param {Object} [options]
 * @constructor
 */
function ConstantsControlPanel( selectedConstantProperty, constantEnumeration, title, tandem, options ) {
  options = merge( {
    cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
    visible: true,
    fill: 'white',
    stroke: 'gray',
    tandem: tandem
  }, options );

  Node.call( this, options );

  const constantsSelectionButtonOptions = {
    font: TITLE_FONT,
    maxWidth: 130
  };

  const thicknessText = new Text( thicknessString, constantsSelectionButtonOptions );
  const thicknessRadioButton = new AquaRadioButton(
    selectedConstantProperty, constantEnumeration.SPRING_THICKNESS, thicknessText, {
      radius: MassesAndSpringsConstants.RADIO_BUTTON_RADIUS,
      tandem: tandem.createTandem( 'thicknessRadioButton' )
    } );

  const constantText = new Text( springConstantString, {
    font: TITLE_FONT,
    tandem: tandem.createTandem( 'constantText' )
  } );
  const springConstantRadioButton = new AquaRadioButton(
    selectedConstantProperty, constantEnumeration.SPRING_CONSTANT, constantText, {
      radius: MassesAndSpringsConstants.RADIO_BUTTON_RADIUS,
      tandem: tandem.createTandem( 'springConstantRadioButton' )
    } );

  const nodeContent = new VBox( {
    align: 'left',
    spacing: RADIO_BUTTON_SPACING,
    children: [
      new Text( title, {
        font: TITLE_FONT,
        maxWidth: 150,
        tandem: tandem
      } ), springConstantRadioButton, thicknessRadioButton
    ],
    tandem: tandem.createTandem( 'vBox' )
  } );
  this.addChild( nodeContent );
}

massesAndSprings.register( 'ConstantsControlPanel', ConstantsControlPanel );
inherit( Node, ConstantsControlPanel );
export default ConstantsControlPanel;