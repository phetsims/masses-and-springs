// Copyright 2017-2019, University of Colorado Boulder

/**
 * Panel responsible for keeping the spring constant and spring thickness constant.
 * This panel should only be visible when in scene with adjustable spring length.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var springConstantString = require( 'string!MASSES_AND_SPRINGS/springConstant' );
  var thicknessString = require( 'string!MASSES_AND_SPRINGS/thickness' );

  // constants
  var TITLE_FONT = MassesAndSpringsConstants.LABEL_FONT;
  var RADIO_BUTTON_SPACING = 4;

  /**
   * @param {Property.<string>} selectedConstantProperty - determines which value to hold constant
   * @param {Enumeration} constantEnumeration - Choices for constant parameter
   * @param {string} title - string used to title the panel
   * @param {tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function ConstantsControlPanel( selectedConstantProperty, constantEnumeration, title, tandem, options ) {
    options = _.extend( {
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      visible: true,
      fill: 'white',
      stroke: 'gray',
      tandem: tandem
    }, options );

    Node.call( this, options );

    var constantsSelectionButtonOptions = {
      font: TITLE_FONT,
      maxWidth: 130
    };

    var thicknessText = new Text( thicknessString, constantsSelectionButtonOptions );
    var thicknessRadioButton = new AquaRadioButton(
      selectedConstantProperty, constantEnumeration.SPRING_THICKNESS, thicknessText, {
        radius: MassesAndSpringsConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'thicknessRadioButton' )
      } );

    var constantText = new Text( springConstantString, {
      font: TITLE_FONT,
      tandem: tandem.createTandem( 'constantText' )
    } );
    var springConstantRadioButton = new AquaRadioButton(
      selectedConstantProperty, constantEnumeration.SPRING_CONSTANT, constantText, {
        radius: MassesAndSpringsConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'springConstantRadioButton' )
      } );

    var nodeContent = new VBox( {
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
  return inherit( Node, ConstantsControlPanel );

} );
