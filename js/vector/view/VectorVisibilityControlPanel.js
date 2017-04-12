// Copyright 2016-2017, University of Colorado Boulder

/**
 * Panel that manages options visibility for vectors.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );
  var Panel = require( 'SUN/Panel' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VerticalCheckBoxGroup = require( 'SUN/VerticalCheckBoxGroup' );
  var VStrut = require( 'SCENERY/nodes/VStrut' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // strings
  var velocityString = require( 'string!MASSES_AND_SPRINGS/velocity' );
  var accelerationString = require( 'string!MASSES_AND_SPRINGS/acceleration' );
  var forcesString = require( 'string!MASSES_AND_SPRINGS/forces' );
  var netForceString = require( 'string!MASSES_AND_SPRINGS/netForce' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var springString = require( 'string!MASSES_AND_SPRINGS/spring' );

  var ARROW_LENGTH = 24;
  var ARROW_HEAD_WIDTH = 14;
  var ARROW_TAIL_WIDTH = 8;
  var SMALLER_ARROW_HEAD_WIDTH = 11;
  var SMALLER_ARROW_TAIL_WIDTH = 3;
  var VELOCITY_ARROW_COLOR = 'rgb( 41, 253, 46 )';
  var ACCELERATION_ARROW_COLOR = 'rgb( 255, 253, 56 )';
  var GRAVITY_ARROW_COLOR = 'rgb( 236, 63, 71 )';
  var SPRING_ARROW_COLOR = 'rgb( 36, 36, 255 )';

  /**
   * @param {VectorModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function VectorVisibilityControlPanel( model, tandem, options ) {
    var self = this;

    // Creation of arrow nodes to be used in vector screen.
    var createArrow = function( tailX, tipX, color, strokeColor, arrowTailWidth, arrowHeadWidth, tandemID ) {
      return new ArrowNode( tailX, 0, tipX, 0, {
        fill: color,
        stroke: strokeColor,
        centerY: 0,
        tailWidth: arrowTailWidth,
        headWidth: arrowHeadWidth,
        tandem: tandem.createTandem( tandemID )
      } );
    };
    var velocityArrow = createArrow( 10, 10 + ARROW_LENGTH, VELOCITY_ARROW_COLOR, 'black', ARROW_TAIL_WIDTH, ARROW_HEAD_WIDTH, 'velocityArrow' );
    var accelerationArrow = createArrow( 10, 10 + ARROW_LENGTH, ACCELERATION_ARROW_COLOR, 'black', ARROW_TAIL_WIDTH, ARROW_HEAD_WIDTH, 'accelerationArrow' );
    var gravityArrow = createArrow( 5, 7 + ARROW_LENGTH, GRAVITY_ARROW_COLOR, GRAVITY_ARROW_COLOR, SMALLER_ARROW_TAIL_WIDTH, SMALLER_ARROW_HEAD_WIDTH, 'gravityArrow' );
    var springArrow = createArrow( 5, 7 + ARROW_LENGTH, SPRING_ARROW_COLOR, SPRING_ARROW_COLOR, SMALLER_ARROW_TAIL_WIDTH, SMALLER_ARROW_HEAD_WIDTH, 'springArrow' );
    var netForceArrow = createArrow( 5, 7 + ARROW_LENGTH, 'black', 'black', SMALLER_ARROW_TAIL_WIDTH, SMALLER_ARROW_HEAD_WIDTH, 'netForceArrow' );

    var vectorVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( {
          children: [ new Text( velocityString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'velocityString' )
          } ), new HStrut( 79 ), velocityArrow ]
        } ),
        property: model.velocityVectorVisibilityProperty,
        label: velocityString
      },
      {
        content: new HBox( {
          children: [ new Text( accelerationString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'accelerationString' )
          } ), new HStrut( 57 ), accelerationArrow ]
        } ),
        property: model.accelerationVectorVisibilityProperty,
        label: accelerationString
      }
    ], {
      tandem: tandem.createTandem( 'vectorVisibilityCheckBoxGroup' )
    } );
    var forcesVisibilityCheckBoxGroup = new VerticalCheckBoxGroup( [
      {
        content: new HBox( {
          children: [ new Text( gravityString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'gravityString' )
          } ), new HStrut( 79 ), gravityArrow ]
        } ),
        property: model.gravityVectorVisibilityProperty,
        label: gravityString
      },
      {
        content: new HBox( {
          children: [ new Text( springString, {
            font: MassesAndSpringsConstants.FONT,
            tandem: tandem.createTandem( 'springString' )
          } ), new HStrut( 57 ), springArrow ]
        } ),
        property: model.springVectorVisibilityProperty,
        label: springString
      }
    ], {
      xMargin: 20,
      tandem: tandem.createTandem( 'vectorVisibilityCheckBoxGroup' )
    } );

    var forcesVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      'forces',
      new Text( forcesString, {
        font: MassesAndSpringsConstants.FONT,
        tandem: tandem.createTandem( 'forcesString' )
      } ),
      { radius: 9, spacing: 8 }
    );

    var netForceVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      'netForce',
      new HBox( {
        children: [ new Text( netForceString, {
          font: MassesAndSpringsConstants.FONT,
          tandem: tandem.createTandem( 'netForceString' )
        } ), new HStrut( 57 ), netForceArrow ]
      } ),
      { radius: 9, spacing: 8 }
    );

    model.forcesModeProperty.link( function( mode ) {
      if ( mode === 'forces' ) {
        forcesVisibilityCheckBoxGroup.pickable = true;
        forcesVisibilityCheckBoxGroup.opacity = 1;
      }
      else if ( mode === 'netForce' ) {
        forcesVisibilityCheckBoxGroup.pickable = false;
        forcesVisibilityCheckBoxGroup.opacity = 0.3;
      }
    } );

    var titleToControlsVerticalSpace = 2;
    var vectorVisibilityControlsVBox = new VBox( {
        children: [
          new VStrut( titleToControlsVerticalSpace ),
          vectorVisibilityCheckBoxGroup,
          new VStrut( titleToControlsVerticalSpace + 8 ),
          forcesVisibilityRadioButton,
          new VStrut( titleToControlsVerticalSpace + 8 ),
          new HBox( { children: [ new HStrut( 15 ), forcesVisibilityCheckBoxGroup ] } ),
          new VStrut( titleToControlsVerticalSpace + 8 ),
          netForceVisibilityRadioButton
        ],
      align: 'left',
      tandem: tandem.createTandem( 'titleToControlsVerticalSpace' )
      }
    );
    Panel.call( this,
      vectorVisibilityControlsVBox,
      {
        minWidth: MassesAndSpringsConstants.PANEL_MAX_WIDTH,
        xMargin: 10,
        fill: 'rgb( 240, 240, 240 )',
        cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
        tandem: tandem.createTandem( 'vectorVisibilityControlPanel' )
      }
    );
    self.mutate( options );
    model.netForceVectorVisibilityProperty.link( function( netForceVisibility ) {
      if ( netForceVisibility === true ) {
        model.forcesVectorVisibilityProperty.set( false );
        model.gravityVectorVisibilityProperty.set( false );
        model.springVectorVisibilityProperty.set( false );
      }
    } );
    model.forcesVectorVisibilityProperty.link( function( forceVisibility ) {
      if ( forceVisibility === true ) {
        model.netForceVectorVisibilityProperty.set( false );
      }
    } );
  }

  massesAndSprings.register( 'VectorVisibilityControlPanel', VectorVisibilityControlPanel );

  return inherit( Panel, VectorVisibilityControlPanel );
} );
