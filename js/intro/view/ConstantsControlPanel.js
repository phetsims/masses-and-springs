// Copyright 2017-2018, University of Colorado Boulder

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
  var ConstantModeChoice = require( 'MASSES_AND_SPRINGS/intro/enum/ConstantModeChoice' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // strings
  var springStrengthString = require( 'string!MASSES_AND_SPRINGS/springStrength' );
  var thicknessString = require( 'string!MASSES_AND_SPRINGS/thickness' );

  // constants
  var TITLE_FONT = MassesAndSpringsConstants.LABEL_FONT;
  var RADIO_BUTTON_SPACING = 4;

  /**
   * @param {Property.<string>} selectedConstantProperty determines which value to hold constant
   * @param {string} title: string used to title the panel
   * @param {tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function ConstantsControlPanel( selectedConstantProperty, title, tandem, options ) {
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
      selectedConstantProperty, ConstantModeChoice.SPRING_THICKNESS, thicknessText, {
        radius: MassesAndSpringsConstants.RADIO_BUTTON_RADIUS,
        tandem: tandem.createTandem( 'thicknessRadioButton' )
      } );

    var constantText = new Text(
      StringUtils.fillIn( springStrengthString, { spring: '' } ),
      _.extend( { font: TITLE_FONT, tandem: tandem.createTandem( 'constantText' ) },
        constantsSelectionButtonOptions ) );
    var springConstantRadioButton = new AquaRadioButton(
      selectedConstantProperty, ConstantModeChoice.SPRING_CONSTANT, constantText, {
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
