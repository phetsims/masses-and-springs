// Copyright 2017-2018, University of Colorado Boulder

/**
 * Panel that manages options visibility for vectors and period trace in Basics version.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var AlignBox = require( 'SCENERY/nodes/AlignBox' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var AquaRadioButton = require( 'SUN/AquaRadioButton' );
  var ForcesModeChoice = require( 'MASSES_AND_SPRINGS/common/enum/ForcesModeChoice' );
  var ForceVectorArrow = require( 'MASSES_AND_SPRINGS/common/view/ForceVectorArrow' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var VectorArrow = require( 'MASSES_AND_SPRINGS/common/view/VectorArrow' );
  var VerticalCheckboxGroup = require( 'SUN/VerticalCheckboxGroup' );

  // strings
  var accelerationString = require( 'string!MASSES_AND_SPRINGS/acceleration' );
  var forcesString = require( 'string!MASSES_AND_SPRINGS/forces' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var netForceString = require( 'string!MASSES_AND_SPRINGS/netForce' );
  var periodTraceString = require( 'string!MASSES_AND_SPRINGS/periodTrace' );
  var springString = require( 'string!MASSES_AND_SPRINGS/spring' );
  var velocityString = require( 'string!MASSES_AND_SPRINGS/velocity' );

  // constants
  var MAX_WIDTH = 205;
  var CONTENT_SPACING = 73;

  /**
   * @param {VectorModel} model
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function VectorVisibilityControlNode( model, tandem, options ) {
    options = _.extend( {
      showForces: true,
      fill: MassesAndSpringsConstants.PANEL_FILL,
      tandem: tandem.createTandem( 'vectorVisibilityControlNode' )
    }, options );

    Node.call( this, options );

    var velocityArrow = new VectorArrow( MassesAndSpringsConstants.VELOCITY_ARROW_COLOR );
    var accelerationArrow = new VectorArrow( MassesAndSpringsConstants.ACCELERATION_ARROW_COLOR );
    var gravityArrow = new ForceVectorArrow( MassesAndSpringsConstants.GRAVITY_ARROW_COLOR );
    var springArrow = new ForceVectorArrow( MassesAndSpringsConstants.SPRING_ARROW_COLOR );
    var netForceArrow = new ForceVectorArrow( 'black' );

    // Align group used for label align boxes
    var alignGroup = new AlignGroup( { matchVertical: false } );

    var velocityAlignBox = new AlignBox( new Text( velocityString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'velocityString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    var accelerationAlignBox = new AlignBox( new Text( accelerationString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'accelerationString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Responsible for velocity and acceleration vectors checkboxes and period trace in basics version
    var vectorVisibilityCheckboxGroup;

    if ( !model.options.basicsVersion ) {
      vectorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
        node: new HBox( { children: [ velocityAlignBox, velocityArrow ], spacing: CONTENT_SPACING } ),
        property: model.velocityVectorVisibilityProperty,
        label: velocityString
      }, {
        node: new HBox( { children: [ accelerationAlignBox, accelerationArrow ], spacing: CONTENT_SPACING } ),
        property: model.accelerationVectorVisibilityProperty,
        label: accelerationString
      } ], {
        checkboxOptions: {
          boxWidth: 16,
          spacing: 8
        },
        tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
      } );
    }
    else {
      vectorVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
        node: new Text( periodTraceString, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          maxWidth: MAX_WIDTH,
          tandem: tandem.createTandem( 'periodTraceString' )
        } ),
        property: model.firstSpring.periodTraceVisibilityProperty
      }, {
        node: new HBox( { children: [ velocityAlignBox, velocityArrow ], spacing: CONTENT_SPACING } ),
        property: model.velocityVectorVisibilityProperty,
        label: velocityString
      }, {
        node: new HBox( { children: [ accelerationAlignBox, accelerationArrow ], spacing: CONTENT_SPACING } ),
        property: model.accelerationVectorVisibilityProperty,
        label: accelerationString
      }
      ], {
        checkboxOptions: {
          boxWidth: 16,
          spacing: 8
        },
        tandem: tandem.createTandem( 'vectorVisibilityCheckboxGroup' )
      } );
    }

    var gravityAlignBox = new AlignBox( new Text( gravityString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'gravityString' )
    } ), { group: alignGroup, xAlign: 'left' } );
    var springAlignBox = new AlignBox( new Text( springString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'springString' )
    } ), { group: alignGroup, xAlign: 'left' } );

    // Responsible for forces vectors checkboxes
    var forcesVisibilityCheckboxGroup = new VerticalCheckboxGroup( [ {
      node: new HBox( { children: [ gravityAlignBox, gravityArrow ], spacing: CONTENT_SPACING - 22 } ),
      property: model.gravityVectorVisibilityProperty,
      label: gravityString
    }, {
      node: new HBox( { children: [ springAlignBox, springArrow ], spacing: CONTENT_SPACING - 22 } ),
      property: model.springVectorVisibilityProperty,
      label: springString
    } ], {
      checkboxOptions: {
        boxWidth: 16
      },
      xMargin: 20,
      tandem: tandem.createTandem( 'forcesVisibilityCheckboxGroup' )
    } );

    // responsible for forces aquaRadioButton
    var forcesVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      ForcesModeChoice.FORCES,
      new Text( forcesString, {
        font: MassesAndSpringsConstants.TITLE_FONT,
        maxWidth: MAX_WIDTH,
        tandem: tandem.createTandem( 'forcesString' )
      } ),
      { radius: 7, spacing: 7 }
    );

    // responsible for net force aquaRadioButton
    var netForceAlignBox = new AlignBox( new Text( netForceString, {
      font: MassesAndSpringsConstants.TITLE_FONT,
      maxWidth: MAX_WIDTH,
      tandem: tandem.createTandem( 'netForceString' )
    } ), { group: alignGroup, xAlign: 'left' } );
    var netForceVisibilityRadioButton = new AquaRadioButton(
      model.forcesModeProperty,
      ForcesModeChoice.NET_FORCES,
      new HBox( { children: [ netForceAlignBox, netForceArrow ], spacing: CONTENT_SPACING } ),
      { radius: 7, spacing: 7 }
    );

    // manages the mutability of the forces checkboxes dependent on the forces and net force aquaRadioButton
    model.forcesModeProperty.link( function( mode ) {
      if ( mode === ForcesModeChoice.FORCES ) {
        forcesVisibilityCheckboxGroup.pickable = true;
        forcesVisibilityCheckboxGroup.opacity = 1;
      }
      else if ( mode === ForcesModeChoice.NET_FORCES ) {
        forcesVisibilityCheckboxGroup.pickable = false;
        forcesVisibilityCheckboxGroup.opacity = 0.3;
      }
    } );

    // Contains all checkboxes and radio buttons for vector visibility
    var vectorVisibilityControlsVBox;

    // groups the checkboxes and forces aquaRadioButton
    if ( options.showForces ) {
      vectorVisibilityControlsVBox = new VBox( {
          children: [
            vectorVisibilityCheckboxGroup,
            forcesVisibilityRadioButton,
            new AlignBox( forcesVisibilityCheckboxGroup, { leftMargin: 22 } ),
            netForceVisibilityRadioButton
          ],
          spacing: 8,
          align: 'left',
          tandem: tandem.createTandem( 'spacingUnit' )
        }
      );
    }
    else {
      vectorVisibilityControlsVBox = new VBox( {
        children: [
          vectorVisibilityCheckboxGroup
        ],
        align: 'left',
        tandem: tandem.createTandem( 'spacingUnit' )
      } );
    }
    var controlsHBox = new HBox( {
      spacing: 65,
      children: [
        vectorVisibilityControlsVBox
      ]
    } );
    this.addChild( controlsHBox );
  }

  massesAndSprings.register( 'VectorVisibilityControlNode', VectorVisibilityControlNode );

  return inherit( Node, VectorVisibilityControlNode );
} );